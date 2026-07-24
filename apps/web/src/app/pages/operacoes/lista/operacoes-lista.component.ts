import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EtapaOperacao, Operacao, OperacoesService, Visibilidade } from '../operacoes.service';

@Component({
  selector: 'app-operacoes-lista',
  standalone: true,
  imports: [RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './operacoes-lista.component.html',
  styleUrl: './operacoes-lista.component.css'
})
export class OperacoesListaComponent implements OnInit {
  private readonly service = inject(OperacoesService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly operacoes = signal<Operacao[]>([]);
  readonly etapas = signal<EtapaOperacao[]>([]);
  readonly visibilidades = signal<Visibilidade[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal('');
  readonly erroCadastro = signal('');
  readonly busca = signal('');
  readonly modalAberto = signal(false);
  readonly salvando = signal(false);

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

  readonly filtradas = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    if (!termo) return this.operacoes();
    return this.operacoes().filter(op =>
      op.nome.toLowerCase().includes(termo) ||
      (op.numeroInquerito ?? '').toLowerCase().includes(termo)
    );
  });

  ngOnInit(): void {
    this.service.listarEtapas().subscribe({
      next: itens => {
        this.etapas.set(itens);
        if (itens.length && !itens.some(x => x.id === 10)) this.form.controls.etapaId.setValue(itens[0].id);
      }
    });
    this.service.listarVisibilidades().subscribe({ next: itens => this.visibilidades.set(itens) });
    this.carregarOperacoes();
    this.route.queryParamMap.subscribe(params => {
      if (params.get('novo') === '1') this.abrirCadastro(false);
    });
  }

  @HostListener('document:keydown.escape')
  fecharComEsc(): void { if (this.modalAberto()) this.fecharCadastro(); }

  abrirCadastro(atualizarUrl = true): void {
    this.erroCadastro.set('');
    this.form.reset({
      nome: '', numeroInquerito: '', razaoNome: '', dataInicio: '', descricao: '', notas: '', etapaId: 10, visibilidadeId: 'R'
    });
    this.modalAberto.set(true);
    document.body.style.overflow = 'hidden';
    if (atualizarUrl) this.router.navigate([], { relativeTo: this.route, queryParams: { novo: 1 }, queryParamsHandling: 'merge' });
  }

  fecharCadastro(): void {
    if (this.salvando()) return;
    this.modalAberto.set(false);
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
    this.service.criar({
      ...v,
      numeroInquerito: v.numeroInquerito || null,
      razaoNome: v.razaoNome || null,
      dataInicio: v.dataInicio || null,
      descricao: v.descricao || null,
      notas: v.notas || null
    }).subscribe({
      next: operacao => {
        this.operacoes.update(itens => [operacao, ...itens]);
        this.salvando.set(false);
        this.fecharCadastro();
      },
      error: () => { this.erroCadastro.set('Não foi possível salvar a operação.'); this.salvando.set(false); }
    });
  }

  etapa(id: number): string { return this.etapas().find(item => item.id === id)?.descricao ?? String(id); }
  visibilidade(id: string): string { return this.visibilidades().find(item => item.id === id)?.descricao ?? id; }
  etapaDisponivel(id: number): boolean { return this.etapas().some(item => item.id === id); }

  private carregarOperacoes(): void {
    this.service.listar().subscribe({
      next: value => { this.operacoes.set(value); this.carregando.set(false); },
      error: () => { this.erro.set('Não foi possível carregar as operações.'); this.carregando.set(false); }
    });
  }
}
