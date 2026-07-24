import { FormBuilder, Validators } from '@angular/forms';
import { Operacao, OperacaoPayload } from '../../operacoes.service';
import { OperacaoForm, OperacaoFormValue } from '../models/operacao-form.types';

export const OPERACAO_FORM_VAZIO: OperacaoFormValue = {
  nome: '',
  numeroInquerito: '',
  razaoNome: '',
  dataInicio: '',
  descricao: '',
  notas: '',
  etapaId: 10,
  visibilidadeId: 'R'
};

export function criarOperacaoForm(fb: FormBuilder): OperacaoForm {
  return fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(255)]],
    numeroInquerito: ['', Validators.maxLength(12)],
    razaoNome: ['', Validators.maxLength(1000)],
    dataInicio: [''],
    descricao: ['', Validators.maxLength(2000)],
    notas: ['', Validators.maxLength(4000)],
    etapaId: [10, Validators.required],
    visibilidadeId: ['R', Validators.required]
  });
}

export function operacaoParaFormulario(operacao: Operacao): OperacaoFormValue {
  return {
    nome: operacao.nome,
    numeroInquerito: operacao.numeroInquerito ?? '',
    razaoNome: operacao.razaoNome ?? '',
    dataInicio: operacao.dataInicio ?? '',
    descricao: operacao.descricao ?? '',
    notas: operacao.notas ?? '',
    etapaId: operacao.etapaId,
    visibilidadeId: operacao.visibilidadeId
  };
}

export function formularioParaPayload(valor: OperacaoFormValue): OperacaoPayload {
  return {
    ...valor,
    numeroInquerito: valor.numeroInquerito || null,
    razaoNome: valor.razaoNome || null,
    dataInicio: valor.dataInicio || null,
    descricao: valor.descricao || null,
    notas: valor.notas || null
  };
}
