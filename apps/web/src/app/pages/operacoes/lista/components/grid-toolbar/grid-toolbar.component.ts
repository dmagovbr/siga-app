/** OBJETIVO DO ARQUIVO: Exibe busca, quantidade de registros e ação de novo cadastro.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Declara metadados usados pelo Angular para criar e renderizar o componente.
@Component({
  selector: 'app-grid-toolbar',
  standalone: true,
  templateUrl: './grid-toolbar.component.html'
})
// Exporta este contrato ou implementação para uso por outros módulos.
export class GridToolbarComponent {
  @Input() busca = '';
  @Input() total = 0;
  @Output() buscaChange = new EventEmitter<string>();
}
