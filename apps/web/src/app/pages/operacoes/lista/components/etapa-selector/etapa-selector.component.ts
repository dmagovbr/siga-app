/** OBJETIVO DO ARQUIVO: Exibe e comunica a seleção da etapa da operação.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Declara metadados usados pelo Angular para criar e renderizar o componente.
@Component({
  selector: 'app-etapa-selector',
  standalone: true,
  templateUrl: './etapa-selector.component.html'
})
// Exporta este contrato ou implementação para uso por outros módulos.
export class EtapaSelectorComponent {
  @Input() etapaId = 10;
  @Input() etapasDisponiveis: number[] = [];
  @Output() etapaSelecionada = new EventEmitter<number>();

  /** Executa `disponivel` e mantém esta etapa do fluxo concentrada em um único ponto. */
  disponivel(id: number): boolean {
    // Retorna o valor calculado sem manter estado oculto.
    return this.etapasDisponiveis.includes(id);
  }
}
