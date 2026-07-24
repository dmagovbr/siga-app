import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-etapa-selector',
  standalone: true,
  templateUrl: './etapa-selector.component.html'
})
export class EtapaSelectorComponent {
  @Input() etapaId = 10;
  @Input() etapasDisponiveis: number[] = [];
  @Output() etapaSelecionada = new EventEmitter<number>();

  disponivel(id: number): boolean {
    return this.etapasDisponiveis.includes(id);
  }
}
