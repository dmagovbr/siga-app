/** OBJETIVO DO ARQUIVO: Renderiza os campos reutilizáveis do formulário de operação.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Visibilidade } from '../../../operacoes.service';
import { OperacaoForm } from '../../models/operacao-form.types';

// Declara metadados usados pelo Angular para criar e renderizar o componente.
@Component({
  selector: 'app-operacao-form-fields',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './operacao-form-fields.component.html'
})
// Exporta este contrato ou implementação para uso por outros módulos.
export class OperacaoFormFieldsComponent {
  @Input({ required: true }) form!: OperacaoForm;
  @Input() visibilidades: Visibilidade[] = [];
}
