import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario = 'admin';
  senha = 'Admin@123';
  readonly carregando = signal(false);
  readonly erro = signal('');

  constructor(private readonly auth: AuthService, private readonly router: Router) {
    if (auth.autenticado()) void router.navigateByUrl('/');
  }

  entrar(): void {
    if (!this.usuario.trim() || !this.senha) return;
    this.erro.set('');
    this.carregando.set(true);
    this.auth.login(this.usuario, this.senha)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/'),
        error: () => this.erro.set('Usuário ou senha inválidos.')
      });
  }
}
