import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface Operacao {
  id: number;
  etapaId: number;
  visibilidadeId: string;
  numeroInquerito: string | null;
  nome: string;
  razaoNome: string | null;
  dataInicio: string | null;
  descricao: string | null;
  notas: string | null;
  dataCadastro: string | null;
  dataUltimaAlteracao: string | null;
}

export interface EtapaOperacao { id: number; codigo: string; descricao: string; }
export interface Visibilidade { id: string; descricao: string; }

export interface OperacaoPayload {
  nome: string;
  numeroInquerito: string | null;
  razaoNome: string | null;
  dataInicio: string | null;
  descricao: string | null;
  notas: string | null;
  etapaId: number;
  visibilidadeId: string;
}

@Injectable({ providedIn: 'root' })
export class OperacoesService {
  private readonly http = inject(HttpClient);
  listar() { return this.http.get<Operacao[]>('/api/operacoes'); }
  criar(payload: OperacaoPayload) { return this.http.post<Operacao>('/api/operacoes', payload); }
  listarEtapas() { return this.http.get<EtapaOperacao[]>('/api/etapas-operacao'); }
  listarVisibilidades() { return this.http.get<Visibilidade[]>('/api/visibilidades'); }
}
