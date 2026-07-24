import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Visibilidade } from '../../../operacoes.service';
import { OperacaoForm } from '../../models/operacao-form.types';

@Component({
  selector: 'app-operacao-form-fields',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './operacao-form-fields.component.html'
})
export class OperacaoFormFieldsComponent {
  @Input({ required: true }) form!: OperacaoForm;
  @Input() visibilidades: Visibilidade[] = [];
}
