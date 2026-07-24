/** OBJETIVO DO ARQUIVO: Exibe a estrutura inicial da listagem de eventos.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { Component, signal } from '@angular/core';

// Declara metadados usados pelo Angular para criar e renderizar o componente.
@Component({
  selector: 'app-eventos-lista',
  standalone: true,
  templateUrl: './eventos-lista.component.html',
  styleUrls: ['../../../shared/styles/cadastro-grid.css']
})
// Exporta este contrato ou implementação para uso por outros módulos.
export class EventosListaComponent {
  readonly busca = signal('');
}
