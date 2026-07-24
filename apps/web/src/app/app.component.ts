/** OBJETIVO DO ARQUIVO: Componente raiz que hospeda as rotas da aplicação Angular.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ShellComponent } from './layout/shell.component';

// Declara metadados usados pelo Angular para criar e renderizar o componente.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShellComponent],
  template: `
    @if (loginPage()) { <router-outlet /> }
    @else { <app-shell><router-outlet /></app-shell> }
  `
})
// Exporta este contrato ou implementação para uso por outros módulos.
export class AppComponent {
  readonly loginPage = signal(false);
  /** Executa `constructor` e mantém esta etapa do fluxo concentrada em um único ponto. */
  constructor(router: Router) {
    this.loginPage.set(router.url.startsWith('/login'));
    // Inicia a chamada assíncrona e trata o resultado quando ele chegar.
    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.loginPage.set((event as NavigationEnd).urlAfterRedirects.startsWith('/login'));
    });
  }
}
