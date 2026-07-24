/** OBJETIVO DO ARQUIVO: Define tipos fortes usados pelo formulário de operação.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { FormControl, FormGroup } from '@angular/forms';

// Exporta este contrato ou implementação para uso por outros módulos.
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

// Exporta este contrato ou implementação para uso por outros módulos.
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
