/** OBJETIVO DO ARQUIVO: Controla a estrutura visual do modal de criação e edição.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { Component, EventEmitter, HostListener, Input, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Operacao, Visibilidade } from '../../../operacoes.service';
import { OperacaoForm } from '../../models/operacao-form.types';
import { EtapaSelectorComponent } from '../etapa-selector/etapa-selector.component';
import { OperacaoFormFieldsComponent } from '../operacao-form-fields/operacao-form-fields.component';

// Declara metadados usados pelo Angular para criar e renderizar o componente.
@Component({
  selector: 'app-operacao-modal',
  standalone: true,
  imports: [ReactiveFormsModule, EtapaSelectorComponent, OperacaoFormFieldsComponent],
  templateUrl: './operacao-modal.component.html',
  styleUrl: './operacao-modal.component.css',
  encapsulation: ViewEncapsulation.None
})
// Exporta este contrato ou implementação para uso por outros módulos.
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
  /** Executa `fecharComEsc` e mantém esta etapa do fluxo concentrada em um único ponto. */
  fecharComEsc(): void {
    this.solicitarFechamento();
  }

  /** Executa `solicitarFechamento` e mantém esta etapa do fluxo concentrada em um único ponto. */
  solicitarFechamento(): void {
    // Interrompe ou direciona o fluxo conforme o estado atual.
    if (!this.salvando && !this.removendo) this.fechar.emit();
  }
}
