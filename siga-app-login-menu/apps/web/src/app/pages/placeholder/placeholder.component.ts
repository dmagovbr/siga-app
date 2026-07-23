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
    .page-head{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:22px}.page-head p{margin:0 0 5px;color:#3977aa;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.page-head h1{margin:0;color:#18344d;font-size:28px}.page-head span{display:block;margin-top:7px;color:#6b7884}.page-head button{border:0;border-radius:9px;background:#14528a;color:#fff;padding:11px 18px;font-weight:700}.panel{background:#fff;border:1px solid #dfe7ee;border-radius:14px;min-height:330px;display:grid;place-content:center;text-align:center;box-shadow:0 8px 24px rgba(22,56,85,.05)}.empty-icon{font-size:40px;color:#3977aa}.panel h2{margin:12px 0 7px;color:#18344d}.panel p{margin:0;color:#74818d}
  `]
})
export class PlaceholderComponent {
  readonly grupo = input.required<string>();
  readonly titulo = input.required<string>();
  readonly descricao = input('');
}
