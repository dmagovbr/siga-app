import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EtapaOperacao, OperacoesService, Visibilidade } from '../operacoes.service';

@Component({
  selector: 'app-operacao-cadastro', standalone: true, imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './operacao-cadastro.component.html', styleUrl: './operacao-cadastro.component.css'
})
export class OperacaoCadastroComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(OperacoesService);
  private readonly router = inject(Router);
  readonly etapas = signal<EtapaOperacao[]>([]);
  readonly visibilidades = signal<Visibilidade[]>([]);
  readonly salvando = signal(false);
  readonly erro = signal('');
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

  ngOnInit(): void {
    this.service.listarEtapas().subscribe({ next: itens => { this.etapas.set(itens); if (itens.length && !itens.some(x => x.id === 10)) this.form.controls.etapaId.setValue(itens[0].id); } });
    this.service.listarVisibilidades().subscribe({ next: itens => this.visibilidades.set(itens) });
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.salvando.set(true); this.erro.set('');
    const v = this.form.getRawValue();
    this.service.criar({ ...v, numeroInquerito: v.numeroInquerito || null, razaoNome: v.razaoNome || null, dataInicio: v.dataInicio || null, descricao: v.descricao || null, notas: v.notas || null }).subscribe({
      next: () => this.router.navigateByUrl('/operacoes/lista'),
      error: () => { this.erro.set('Não foi possível salvar a operação.'); this.salvando.set(false); }
    });
  }
}
