import { Component, EventEmitter, HostListener, Input, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Operacao, Visibilidade } from '../../../operacoes.service';
import { OperacaoForm } from '../../models/operacao-form.types';
import { EtapaSelectorComponent } from '../etapa-selector/etapa-selector.component';
import { OperacaoFormFieldsComponent } from '../operacao-form-fields/operacao-form-fields.component';

@Component({
  selector: 'app-operacao-modal',
  standalone: true,
  imports: [ReactiveFormsModule, EtapaSelectorComponent, OperacaoFormFieldsComponent],
  templateUrl: './operacao-modal.component.html',
  styleUrl: './operacao-modal.component.css',
  encapsulation: ViewEncapsulation.None
})
export class OperacaoModalComponent {
  @Input({ required: true }) form!: OperacaoForm;
  @Input() operacao: Operacao | null = null;
  @Input() visibilidades: Visibilidade[] = [];
  @Input() etapasDisponiveis: number[] = [];
  @Input() erro = '';
  @Input() salvando = false;
  @Input() removendo = false;

  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<void>();
  @Output() remover = new EventEmitter<void>();
  @Output() etapaSelecionada = new EventEmitter<number>();

  @HostListener('document:keydown.escape')
  fecharComEsc(): void {
    this.solicitarFechamento();
  }

  solicitarFechamento(): void {
    if (!this.salvando && !this.removendo) this.fechar.emit();
  }
}
