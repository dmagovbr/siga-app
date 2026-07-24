import { Component, OnDestroy, OnInit, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { OperacaoModalComponent } from './components/operacao-modal/operacao-modal.component';
import { OperacoesGridComponent } from './components/operacoes-grid/operacoes-grid.component';
import { GridToolbarComponent } from './components/grid-toolbar/grid-toolbar.component';
import { SortDirection, SortField } from './models/operacoes-lista.types';
import { OPERACAO_FORM_VAZIO, criarOperacaoForm, formularioParaPayload, operacaoParaFormulario } from './utils/operacao-form.mapper';
import { EtapaOperacao, Operacao, OperacoesService, Visibilidade } from '../operacoes.service';

@Component({
  selector: 'app-operacoes-lista',
  standalone: true,
  imports: [GridToolbarComponent, OperacoesGridComponent, OperacaoModalComponent],
  templateUrl: './operacoes-lista.component.html',
  styleUrl: '../../../shared/styles/cadastro-grid.css',
  encapsulation: ViewEncapsulation.None
})
export class OperacoesListaComponent implements OnInit, OnDestroy {
  private readonly service = inject(OperacoesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly busca$ = new Subject<string>();

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
  readonly etapasDisponiveis = computed(() => this.etapas().map(item => item.id));
  readonly form = criarOperacaoForm(inject(FormBuilder));

  ngOnInit(): void {
    this.carregarDominios();
    this.configurarBusca();
    this.configurarRotaNovoCadastro();
    this.recarregar();
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
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

  abrirCadastro(atualizarUrl = true): void {
    this.operacaoEmEdicao.set(null);
    this.erroCadastro.set('');
    this.form.reset(OPERACAO_FORM_VAZIO);
    this.abrirModal(atualizarUrl);
  }

  abrirEdicao(operacao: Operacao): void {
    this.operacaoEmEdicao.set(operacao);
    this.erroCadastro.set('');
    this.form.reset(operacaoParaFormulario(operacao));
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
    if (this.etapasDisponiveis().includes(id)) this.form.controls.etapaId.setValue(id);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.erroCadastro.set('');
    const atual = this.operacaoEmEdicao();
    const payload = formularioParaPayload(this.form.getRawValue());
    const requisicao = atual ? this.service.alterar(atual.id, payload) : this.service.criar(payload);

    requisicao.subscribe({
      next: () => this.finalizarMutacao(),
      error: () => {
        this.erroCadastro.set(atual ? 'Não foi possível alterar a operação.' : 'Não foi possível salvar a operação.');
        this.salvando.set(false);
      }
    });
  }

  remover(): void {
    const atual = this.operacaoEmEdicao();
    if (!atual || this.removendo() || !window.confirm(`Remover a operação "${atual.nome}"?`)) return;

    this.removendo.set(true);
    this.erroCadastro.set('');
    this.service.remover(atual.id).subscribe({
      next: () => this.finalizarMutacao(),
      error: () => {
        this.erroCadastro.set('Não foi possível remover a operação.');
        this.removendo.set(false);
      }
    });
  }

  carregarProximaPagina(): void {
    if (this.carregando() || this.carregandoMais() || this.ultimaPagina()) return;
    this.carregarPagina(this.pagina() + 1, true);
  }

  private carregarDominios(): void {
    this.service.listarEtapas().subscribe({
      next: itens => {
        this.etapas.set(itens);
        if (itens.length && !itens.some(item => item.id === 10)) this.form.controls.etapaId.setValue(itens[0].id);
      }
    });
    this.service.listarVisibilidades().subscribe({ next: itens => this.visibilidades.set(itens) });
  }

  private configurarBusca(): void {
    this.busca$.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(() => this.recarregar());
  }

  private configurarRotaNovoCadastro(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params.get('novo') === '1' && !this.modalAberto()) this.abrirCadastro(false);
    });
  }

  private abrirModal(atualizarUrl: boolean): void {
    this.modalAberto.set(true);
    document.body.style.overflow = 'hidden';
    if (atualizarUrl) this.router.navigate([], { relativeTo: this.route, queryParams: { novo: 1 }, queryParamsHandling: 'merge' });
  }

  private finalizarMutacao(): void {
    this.salvando.set(false);
    this.removendo.set(false);
    this.fecharCadastro();
    this.recarregar();
  }

  private recarregar(): void {
    this.pagina.set(0);
    this.ultimaPagina.set(false);
    this.operacoes.set([]);
    this.carregarPagina(0, false);
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
        this.encerrarCarregamento();
      },
      error: () => {
        this.erro.set('Não foi possível carregar as operações.');
        this.encerrarCarregamento();
      }
    });
  }

  private encerrarCarregamento(): void {
    this.carregando.set(false);
    this.carregandoMais.set(false);
  }
}
