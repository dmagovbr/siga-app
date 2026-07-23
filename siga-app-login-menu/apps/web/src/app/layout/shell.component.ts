import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
export class ShellComponent {
  readonly collapsed = signal(false);
  readonly openGroup = signal<string | null>('operacoes');
  readonly usuario = this.auth.usuario;

  constructor(private readonly auth: AuthService, private readonly router: Router) {}
  toggleMenu(): void { this.collapsed.update(value => !value); }
  toggleGroup(group: string): void { this.openGroup.update(value => value === group ? null : group); }
  logout(): void { this.auth.logout(); void this.router.navigateByUrl('/login'); }
  initials(): string {
    return (this.usuario()?.nome ?? 'Usuário').split(/\s+/).slice(0, 2).map(v => v[0]).join('').toUpperCase();
  }
}
