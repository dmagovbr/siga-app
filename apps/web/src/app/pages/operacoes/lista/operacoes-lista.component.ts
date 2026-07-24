import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { LucideIconComponent } from '../../../shared/components/lucide-icon/lucide-icon.component';
import { EtapaOperacao, Operacao, OperacoesService, Visibilidade } from '../operacoes.service';

type SortDirection = 'asc' | 'desc';
type SortField = 'nome' | 'numeroInquerito' | 'etapaId' | 'visibilidadeId' | 'dataInicio';

@Component({
  selector: 'app-operacoes-lista',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, LucideIconComponent],
  templateUrl: './operacoes-lista.component.html',
  styleUrls: ['../../../shared/styles/cadastro-grid.css', './operacoes-lista.component.css']
})
export class OperacoesListaComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly service = inject(OperacoesService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly busca$ = new Subject<string>();
  private observer?: IntersectionObserver;

  @ViewChild('sentinela') set sentinela(elemento: ElementRef<HTMLElement> | undefined) {
    if (elemento && this.observer) this.observer.observe(elemento.nativeElement);
  }

  readonly operacoes = signal<Operacao[]>([]);
  readonly etapas = signal<EtapaOperacao[]>([]);
  readonly visibilidades = signal<Visibilidade[]>([]);
  readonly carregando = signal(true);
  readonly carregandoMais = signal(false);
  readonly erro = signal('');
  readonly erroCadastro = signal('');
  readonly busca = signal('');
  readonly modalAberto = signal(false);
  readonly salvando = signal(false);
  readonly removendo = signal(false);
  readonly operacaoEmEdicao = signal<Operacao | null>(null);
  readonly pagina = signal(0);
  readonly total = signal(0);
  readonly ultimaPagina = signal(false);
  readonly ordenacao = signal<SortField>('nome');
  readonly direcao = signal<SortDirection>('asc');

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(255)]],
    numeroInquerito: ['', Validators.maxLength(12)],
    razaoNome: ['', Validators.maxLength(1000)],
    dataInicio: [''],
    descricao: ['', Validators.maxLength(2000)],
    notas: ['', Validators.maxLength(4000)],
    etapaId: [10, Validators.required],
    visibilidadeId: ['R', Validators.required]
  });

  readonly exibidas = computed(() => this.operacoes());

  ngOnInit(): void {
    this.service.listarEtapas().subscribe({
      next: itens => {
        this.etapas.set(itens);
        if (itens.length && !itens.some(x => x.id === 10)) this.form.controls.etapaId.setValue(itens[0].id);
      }
    });
    this.service.listarVisibilidades().subscribe({ next: itens => this.visibilidades.set(itens) });

    this.busca$.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(() => this.recarregar());
    this.recarregar();

    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params.get('novo') === '1') this.abrirCadastro(false);
    });
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) this.carregarProximaPagina();
    }, { rootMargin: '240px 0px' });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  atualizarBusca(valor: string): void {
    this.busca.set(valor);
    this.busca$.next(valor.trim());
  }

  ordenar(campo: SortField): void {
    if (this.ordenacao() === campo) this.direcao.update(valor => valor === 'asc' ? 'desc' : 'asc');
    else {
      this.ordenacao.set(campo);
      this.direcao.set('asc');
    }
    this.recarregar();
  }

  ariaSort(campo: SortField): 'ascending' | 'descending' | 'none' {
    if (this.ordenacao() !== campo) return 'none';
    return this.direcao() === 'asc' ? 'ascending' : 'descending';
  }

  iniciarRedimensionamento(event: PointerEvent, th: HTMLElement): void {
    event.preventDefault();
    event.stopPropagation();
    const inicioX = event.clientX;
    const larguraInicial = th.getBoundingClientRect().width;
    const min = 90;
    const mover = (e: PointerEvent) => {
      const largura = Math.max(min, Math.round(larguraInicial + e.clientX - inicioX));
      th.style.width = `${largura}px`;
      th.style.minWidth = `${largura}px`;
      th.style.maxWidth = `${largura}px`;
    };
    const soltar = () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
      document.body.classList.remove('grid-resizing');
    };
    document.body.classList.add('grid-resizing');
    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar, { once: true });
  }

  @HostListener('document:keydown.escape')
  fecharComEsc(): void { if (this.modalAberto()) this.fecharCadastro(); }

  abrirCadastro(atualizarUrl = true): void {
    this.operacaoEmEdicao.set(null);
    this.erroCadastro.set('');
    this.form.reset({
      nome: '', numeroInquerito: '', razaoNome: '', dataInicio: '', descricao: '', notas: '', etapaId: 10, visibilidadeId: 'R'
    });
    this.abrirModal(atualizarUrl);
  }

  abrirEdicao(operacao: Operacao): void {
    this.operacaoEmEdicao.set(operacao);
    this.erroCadastro.set('');
    this.form.reset({
      nome: operacao.nome,
      numeroInquerito: operacao.numeroInquerito ?? '',
      razaoNome: operacao.razaoNome ?? '',
      dataInicio: operacao.dataInicio ?? '',
      descricao: operacao.descricao ?? '',
      notas: operacao.notas ?? '',
      etapaId: operacao.etapaId,
      visibilidadeId: operacao.visibilidadeId
    });
    this.abrirModal(false);
  }

  fecharCadastro(): void {
    if (this.salvando() || this.removendo()) return;
    this.modalAberto.set(false);
    this.operacaoEmEdicao.set(null);
    document.body.style.overflow = '';
    this.router.navigate([], { relativeTo: this.route, queryParams: { novo: null }, queryParamsHandling: 'merge', replaceUrl: true });
  }

  selecionarEtapa(id: number): void {
    if (this.etapas().some(item => item.id === id)) this.form.controls.etapaId.setValue(id);
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.salvando.set(true);
    this.erroCadastro.set('');
    const v = this.form.getRawValue();
    const payload = {
      ...v,
      numeroInquerito: v.numeroInquerito || null,
      razaoNome: v.razaoNome || null,
      dataInicio: v.dataInicio || null,
      descricao: v.descricao || null,
      notas: v.notas || null
    };
    const atual = this.operacaoEmEdicao();
    const requisicao = atual ? this.service.alterar(atual.id, payload) : this.service.criar(payload);
    requisicao.subscribe({
      next: () => {
        this.salvando.set(false);
        this.fecharCadastro();
        this.recarregar();
      },
      error: () => {
        this.erroCadastro.set(atual ? 'Não foi possível alterar a operação.' : 'Não foi possível salvar a operação.');
        this.salvando.set(false);
      }
    });
  }

  remover(): void {
    const atual = this.operacaoEmEdicao();
    if (!atual || this.removendo()) return;
    if (!window.confirm(`Remover a operação "${atual.nome}"?`)) return;
    this.removendo.set(true);
    this.erroCadastro.set('');
    this.service.remover(atual.id).subscribe({
      next: () => {
        this.removendo.set(false);
        this.fecharCadastro();
        this.recarregar();
      },
      error: () => {
        this.erroCadastro.set('Não foi possível remover a operação.');
        this.removendo.set(false);
      }
    });
  }

  etapa(id: number): string { return this.etapas().find(item => item.id === id)?.descricao ?? String(id); }
  visibilidade(id: string): string { return this.visibilidades().find(item => item.id === id)?.descricao ?? id; }
  etapaDisponivel(id: number): boolean { return this.etapas().some(item => item.id === id); }

  private abrirModal(atualizarUrl: boolean): void {
    this.modalAberto.set(true);
    document.body.style.overflow = 'hidden';
    if (atualizarUrl) this.router.navigate([], { relativeTo: this.route, queryParams: { novo: 1 }, queryParamsHandling: 'merge' });
  }

  private recarregar(): void {
    this.pagina.set(0);
    this.ultimaPagina.set(false);
    this.operacoes.set([]);
    this.carregarPagina(0, false);
  }

  private carregarProximaPagina(): void {
    if (this.carregando() || this.carregandoMais() || this.ultimaPagina()) return;
    this.carregarPagina(this.pagina() + 1, true);
  }

  private carregarPagina(pagina: number, acumular: boolean): void {
    acumular ? this.carregandoMais.set(true) : this.carregando.set(true);
    this.erro.set('');
    this.service.listar(pagina, 20, this.ordenacao(), this.direcao(), this.busca().trim()).subscribe({
      next: resposta => {
        this.operacoes.update(atuais => acumular ? [...atuais, ...resposta.content] : resposta.content);
        this.pagina.set(resposta.number);
        this.total.set(resposta.totalElements);
        this.ultimaPagina.set(resposta.last);
        this.carregando.set(false);
        this.carregandoMais.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as operações.');
        this.carregando.set(false);
        this.carregandoMais.set(false);
      }
    });
  }
}
