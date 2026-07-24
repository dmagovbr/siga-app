import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-grid-toolbar',
  standalone: true,
  templateUrl: './grid-toolbar.component.html'
})
export class GridToolbarComponent {
  @Input() busca = '';
  @Input() total = 0;
  @Output() buscaChange = new EventEmitter<string>();
}
