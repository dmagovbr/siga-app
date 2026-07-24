/** OBJETIVO DO ARQUIVO: Controla o layout autenticado, menu, tema e calculadora.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CalculatorComponent } from '../shared/components/calculator/calculator.component';

interface HealthResponse { status: string; }
type Theme = 'light' | 'dark';
type ApiStatus = 'carregando' | 'online' | 'offline';

// Declara metadados usados pelo Angular para criar e renderizar o componente.
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CalculatorComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
// Exporta este contrato ou implementação para uso por outros módulos.
export class ShellComponent implements OnInit {
  readonly collapsed = signal(false);
  readonly openGroup = signal<string | null>('operacoes');
  readonly usuario = this.auth.usuario;
  readonly theme = signal<Theme>('light');
  readonly apiStatus = signal<ApiStatus>('carregando');

  // Recebe dependências externas pelo mecanismo de injeção do Angular/TypeScript.
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

  /** Executa `ngOnInit` e mantém esta etapa do fluxo concentrada em um único ponto. */
  ngOnInit(): void {
    // Inicia a chamada assíncrona e trata o resultado quando ele chegar.
    this.http.get<HealthResponse>('/api/health').subscribe({
      next: response => this.apiStatus.set(response.status === 'ok' ? 'online' : 'offline'),
      error: () => this.apiStatus.set('offline')
    });
  }

  toggleMenu(): void { this.collapsed.update(value => !value); }
  toggleGroup(group: string): void { this.openGroup.update(value => value === group ? null : group); }
  toggleTheme(): void { this.applyTheme(this.theme() === 'light' ? 'dark' : 'light'); }
  logout(): void { this.auth.logout(); void this.router.navigateByUrl('/login'); }

  /** Executa `initials` e mantém esta etapa do fluxo concentrada em um único ponto. */
  initials(): string {
    // Retorna o valor calculado sem manter estado oculto.
    return (this.usuario()?.nome ?? 'Usuário')
      .split(/\s+/)
      .slice(0, 2)
      .map(value => value[0])
      .join('')
      .toUpperCase();
  }

  /** Executa `apiLabel` e mantém esta etapa do fluxo concentrada em um único ponto. */
  apiLabel(): string {
    // Interrompe ou direciona o fluxo conforme o estado atual.
    if (this.apiStatus() === 'online') return 'API online';
    // Interrompe ou direciona o fluxo conforme o estado atual.
    if (this.apiStatus() === 'offline') return 'API indisponível';
    // Retorna o valor calculado sem manter estado oculto.
    return 'Verificando API';
  }

  /** Executa `applyTheme` e mantém esta etapa do fluxo concentrada em um único ponto. */
  private applyTheme(theme: Theme): void {
    this.theme.set(theme);
    document.documentElement.dataset['theme'] = theme;
    localStorage.setItem('sigacrim-theme', theme);
  }
}
