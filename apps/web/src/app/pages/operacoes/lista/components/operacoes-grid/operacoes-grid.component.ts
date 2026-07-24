import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideIconComponent } from '../../../../../shared/components/lucide-icon/lucide-icon.component';
import { ColumnResizeDirective } from '../../../../../shared/directives/column-resize.directive';
import { InfiniteScrollSentinelDirective } from '../../../../../shared/directives/infinite-scroll-sentinel.directive';
import { EtapaOperacao, Operacao, Visibilidade } from '../../../operacoes.service';
import { SortDirection, SortField } from '../../models/operacoes-lista.types';

@Component({
  selector: 'app-operacoes-grid',
  standalone: true,
  imports: [DatePipe, LucideIconComponent, ColumnResizeDirective, InfiniteScrollSentinelDirective],
  templateUrl: './operacoes-grid.component.html'
})
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

  ariaSort(campo: SortField): 'ascending' | 'descending' | 'none' {
    if (this.ordenacao !== campo) return 'none';
    return this.direcao === 'asc' ? 'ascending' : 'descending';
  }

  indicador(campo: SortField): string {
    if (this.ordenacao !== campo) return '↕';
    return this.direcao === 'asc' ? '↑' : '↓';
  }

  etapa(id: number): string {
    return this.etapas.find(item => item.id === id)?.descricao ?? String(id);
  }

  visibilidade(id: string): string {
    return this.visibilidades.find(item => item.id === id)?.descricao ?? id;
  }
}
