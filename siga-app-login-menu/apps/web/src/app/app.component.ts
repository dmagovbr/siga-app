import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ShellComponent } from './layout/shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShellComponent],
  template: `
    @if (loginPage()) { <router-outlet /> }
    @else { <app-shell><router-outlet /></app-shell> }
  `
})
export class AppComponent {
  readonly loginPage = signal(false);
  constructor(router: Router) {
    this.loginPage.set(router.url.startsWith('/login'));
    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.loginPage.set((event as NavigationEnd).urlAfterRedirects.startsWith('/login'));
    });
  }
}
