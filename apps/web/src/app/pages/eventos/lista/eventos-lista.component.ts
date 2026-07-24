import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-eventos-lista',
  standalone: true,
  templateUrl: './eventos-lista.component.html',
  styleUrls: ['../../../shared/styles/cadastro-grid.css']
})
export class EventosListaComponent {
  readonly busca = signal('');
}
