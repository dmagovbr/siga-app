import { FormControl, FormGroup } from '@angular/forms';

export interface OperacaoFormValue {
  nome: string;
  numeroInquerito: string;
  razaoNome: string;
  dataInicio: string;
  descricao: string;
  notas: string;
  etapaId: number;
  visibilidadeId: string;
}

export type OperacaoForm = FormGroup<{
  nome: FormControl<string>;
  numeroInquerito: FormControl<string>;
  razaoNome: FormControl<string>;
  dataInicio: FormControl<string>;
  descricao: FormControl<string>;
  notas: FormControl<string>;
  etapaId: FormControl<number>;
  visibilidadeId: FormControl<string>;
}>;
