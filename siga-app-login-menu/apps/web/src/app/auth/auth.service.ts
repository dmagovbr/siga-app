import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface SessaoUsuario {
  id: number;
  usuario: string;
  nome: string;
  email: string | null;
  trocarSenha: boolean;
  perfis: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'sigacrim.session';
  readonly usuario = signal<SessaoUsuario | null>(this.readSession());

  constructor(private readonly http: HttpClient) {}

  login(usuario: string, senha: string): Observable<SessaoUsuario> {
    return this.http.post<SessaoUsuario>('/api/auth/login', { usuario, senha }).pipe(
      tap(session => {
        localStorage.setItem(this.storageKey, JSON.stringify(session));
        this.usuario.set(session);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.usuario.set(null);
  }

  autenticado(): boolean {
    return this.usuario() !== null;
  }

  private readSession(): SessaoUsuario | null {
    try {
      const value = localStorage.getItem(this.storageKey);
      return value ? JSON.parse(value) as SessaoUsuario : null;
    } catch {
      return null;
    }
  }
}
