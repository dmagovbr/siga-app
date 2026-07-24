import { Component, input } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <section class="page-head">
      <div><p>{{ grupo() }}</p><h1>{{ titulo() }}</h1><span>{{ descricao() }}</span></div>
      <button type="button">Novo</button>
    </section>
    <section class="panel">
      <div class="empty-icon">▦</div>
      <h2>{{ titulo() }}</h2>
      <p>Estrutura inicial pronta para receber esta funcionalidade.</p>
    </section>
  `,
  styles: [`
    .page-head{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:22px}
    .page-head p{margin:0 0 5px;color:var(--gold);font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}
    .page-head h1{margin:0;color:var(--text);font-size:28px;line-height:1.2}
    .page-head span{display:block;margin-top:7px;color:var(--text-soft);line-height:1.5}
    .page-head button{border:1px solid transparent;border-radius:9px;background:#145f9f;color:#fff;padding:11px 18px;font-weight:700;cursor:pointer;transition:filter .15s ease,transform .15s ease}
    .page-head button:hover{filter:brightness(1.12);transform:translateY(-1px)}
    .panel{background:var(--surface);border:1px solid var(--border);border-radius:14px;min-height:330px;display:grid;place-content:center;text-align:center;box-shadow:var(--shadow);transition:background-color .2s ease,border-color .2s ease,color .2s ease}
    .empty-icon{font-size:40px;color:var(--gold)}
    .panel h2{margin:12px 0 7px;color:var(--text)}
    .panel p{margin:0;color:var(--text-soft)}
    @media(max-width:700px){.page-head{align-items:flex-start;flex-direction:column}.page-head button{width:100%}}
  `]
})
export class PlaceholderComponent {
  readonly grupo = input.required<string>();
  readonly titulo = input.required<string>();
  readonly descricao = input('');
}
