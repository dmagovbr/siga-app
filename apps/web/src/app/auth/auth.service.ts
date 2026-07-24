/** OBJETIVO DO ARQUIVO: Centraliza login, logout e leitura da sessão do usuário.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Exporta este contrato ou implementação para uso por outros módulos.
export interface SessaoUsuario {
  id: number;
  usuario: string;
  nome: string;
  email: string | null;
  trocarSenha: boolean;
  perfis: string[];
}

// Permite que o Angular injete esta classe onde ela for necessária.
@Injectable({ providedIn: 'root' })
// Exporta este contrato ou implementação para uso por outros módulos.
export class AuthService {
  private readonly storageKey = 'sigacrim.session';
  readonly usuario = signal<SessaoUsuario | null>(this.readSession());

  // Recebe dependências externas pelo mecanismo de injeção do Angular/TypeScript.
  constructor(private readonly http: HttpClient) {}

  /** Executa `login` e mantém esta etapa do fluxo concentrada em um único ponto. */
  login(usuario: string, senha: string): Observable<SessaoUsuario> {
    // Retorna o valor calculado sem manter estado oculto.
    return this.http.post<SessaoUsuario>('/api/auth/login', { usuario, senha }).pipe(
      tap(session => {
        localStorage.setItem(this.storageKey, JSON.stringify(session));
        this.usuario.set(session);
      })
    );
  }

  /** Executa `logout` e mantém esta etapa do fluxo concentrada em um único ponto. */
  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.usuario.set(null);
  }

  /** Executa `autenticado` e mantém esta etapa do fluxo concentrada em um único ponto. */
  autenticado(): boolean {
    // Retorna o valor calculado sem manter estado oculto.
    return this.usuario() !== null;
  }

  /** Executa `readSession` e mantém esta etapa do fluxo concentrada em um único ponto. */
  private readSession(): SessaoUsuario | null {
    try {
      const value = localStorage.getItem(this.storageKey);
      // Retorna o valor calculado sem manter estado oculto.
      return value ? JSON.parse(value) as SessaoUsuario : null;
    } catch {
      // Retorna o valor calculado sem manter estado oculto.
      return null;
    }
  }
}
