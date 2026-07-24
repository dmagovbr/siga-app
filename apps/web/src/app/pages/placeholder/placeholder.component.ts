import { Component, input } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <header class="page-head">
      <h1>{{ titulo() }}</h1>
    </header>

    <section class="panel" aria-label="{{ titulo() }}">
      <div class="empty-icon" aria-hidden="true">▦</div>
    </section>
  `,
  styles: [`
    :host{display:block}
    .page-head{margin-bottom:14px}
    .page-head h1{margin:0;color:var(--text);font-size:22px;line-height:1.2}
    .panel{background:var(--surface);border:1px solid var(--border);border-radius:10px;min-height:330px;display:grid;place-content:center;box-shadow:var(--shadow);transition:background-color .2s ease,border-color .2s ease,color .2s ease}
    .empty-icon{font-size:36px;color:var(--gold);line-height:1}
  `]
})
export class PlaceholderComponent {
  readonly titulo = input.required<string>();
}
