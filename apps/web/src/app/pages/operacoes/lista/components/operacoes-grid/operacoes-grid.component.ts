/** OBJETIVO DO ARQUIVO: Renderiza o grid e emite ações de ordenar, editar e excluir.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideIconComponent } from '../../../../../shared/components/lucide-icon/lucide-icon.component';
import { ColumnResizeDirective } from '../../../../../shared/directives/column-resize.directive';
import { InfiniteScrollSentinelDirective } from '../../../../../shared/directives/infinite-scroll-sentinel.directive';
import { EtapaOperacao, Operacao, Visibilidade } from '../../../operacoes.service';
import { SortDirection, SortField } from '../../models/operacoes-lista.types';

// Declara metadados usados pelo Angular para criar e renderizar o componente.
@Component({
  selector: 'app-operacoes-grid',
  standalone: true,
  imports: [DatePipe, LucideIconComponent, ColumnResizeDirective, InfiniteScrollSentinelDirective],
  templateUrl: './operacoes-grid.component.html'
})
// Exporta este contrato ou implementação para uso por outros módulos.
export class OperacoesGridComponent {
  @Input() operacoes: Operacao[] = [];
  @Input() etapas: EtapaOperacao[] = [];
  @Input() visibilidades: Visibilidade[] = [];
  @Input() carregando = false;
  @Input() carregandoMais = false;
  @Input() erro = '';
  @Input() ordenacao: SortField = 'nome';
  @Input() direcao: SortDirection = 'asc';

  @Output() ordenar = new EventEmitter<SortField>();
  @Output() editar = new EventEmitter<Operacao>();
  @Output() carregarMais = new EventEmitter<void>();

  /** Executa `ariaSort` e mantém esta etapa do fluxo concentrada em um único ponto. */
  ariaSort(campo: SortField): 'ascending' | 'descending' | 'none' {
    // Interrompe ou direciona o fluxo conforme o estado atual.
    if (this.ordenacao !== campo) return 'none';
    // Retorna o valor calculado sem manter estado oculto.
    return this.direcao === 'asc' ? 'ascending' : 'descending';
  }

  /** Executa `indicador` e mantém esta etapa do fluxo concentrada em um único ponto. */
  indicador(campo: SortField): string {
    // Interrompe ou direciona o fluxo conforme o estado atual.
    if (this.ordenacao !== campo) return '↕';
    // Retorna o valor calculado sem manter estado oculto.
    return this.direcao === 'asc' ? '↑' : '↓';
  }

  /** Executa `etapa` e mantém esta etapa do fluxo concentrada em um único ponto. */
  etapa(id: number): string {
    // Retorna o valor calculado sem manter estado oculto.
    return this.etapas.find(item => item.id === id)?.descricao ?? String(id);
  }

  /** Executa `visibilidade` e mantém esta etapa do fluxo concentrada em um único ponto. */
  visibilidade(id: string): string {
    // Retorna o valor calculado sem manter estado oculto.
    return this.visibilidades.find(item => item.id === id)?.descricao ?? id;
  }
}
