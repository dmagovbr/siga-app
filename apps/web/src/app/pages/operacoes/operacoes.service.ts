import { HttpClient, HttpParams } from '@angular/common/http';
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

export interface Pagina<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
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

  listar(page = 0, size = 20, sort = 'id', direction: 'asc' | 'desc' = 'desc', q = '') {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort)
      .set('direction', direction)
      .set('q', q);
    return this.http.get<Pagina<Operacao>>('/api/operacoes', { params });
  }

  criar(payload: OperacaoPayload) { return this.http.post<Operacao>('/api/operacoes', payload); }
  alterar(id: number, payload: OperacaoPayload) { return this.http.put<Operacao>(`/api/operacoes/${id}`, payload); }
  remover(id: number) { return this.http.delete<void>(`/api/operacoes/${id}`); }
  listarEtapas() { return this.http.get<EtapaOperacao[]>('/api/etapas-operacao'); }
  listarVisibilidades() { return this.http.get<Visibilidade[]>('/api/visibilidades'); }
}
