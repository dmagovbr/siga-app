import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface HealthResponse { status: string; }
type Theme = 'light' | 'dark';
type ApiStatus = 'carregando' | 'online' | 'offline';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
export class ShellComponent implements OnInit {
  readonly collapsed = signal(false);
  readonly openGroup = signal<string | null>('operacoes');
  readonly usuario = this.auth.usuario;
  readonly theme = signal<Theme>('light');
  readonly apiStatus = signal<ApiStatus>('carregando');

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    const savedTheme = localStorage.getItem('sigacrim-theme');
    const initialTheme: Theme = savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : 'light';
    this.applyTheme(initialTheme);
  }

  ngOnInit(): void {
    this.http.get<HealthResponse>('/api/health').subscribe({
      next: response => this.apiStatus.set(response.status === 'ok' ? 'online' : 'offline'),
      error: () => this.apiStatus.set('offline')
    });
  }

  toggleMenu(): void { this.collapsed.update(value => !value); }
  toggleGroup(group: string): void { this.openGroup.update(value => value === group ? null : group); }
  toggleTheme(): void { this.applyTheme(this.theme() === 'light' ? 'dark' : 'light'); }
  logout(): void { this.auth.logout(); void this.router.navigateByUrl('/login'); }

  initials(): string {
    return (this.usuario()?.nome ?? 'Usuário')
      .split(/\s+/)
      .slice(0, 2)
      .map(value => value[0])
      .join('')
      .toUpperCase();
  }

  apiLabel(): string {
    if (this.apiStatus() === 'online') return 'API online';
    if (this.apiStatus() === 'offline') return 'API indisponível';
    return 'Verificando API';
  }

  private applyTheme(theme: Theme): void {
    this.theme.set(theme);
    document.documentElement.dataset['theme'] = theme;
    localStorage.setItem('sigacrim-theme', theme);
  }
}
