/** OBJETIVO DO ARQUIVO: Controla o formulário e o fluxo de autenticação.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {finalize} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

// Declara metadados usados pelo Angular para criar e renderizar o componente.
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
// Exporta este contrato ou implementação para uso por outros módulos.
export class LoginComponent {
    usuario = 'admin';
    senha = 'Admin@123';
    readonly carregando = signal(false);
    readonly erro = signal('');

    /** Executa `constructor` e mantém esta etapa do fluxo concentrada em um único ponto. */
    constructor(private readonly auth: AuthService, private readonly router: Router) {
        // Interrompe ou direciona o fluxo conforme o estado atual.
        if (auth.autenticado()) void router.navigateByUrl('/');
    }

    /** Executa `entrar` e mantém esta etapa do fluxo concentrada em um único ponto. */
    entrar(): void {
        // Interrompe ou direciona o fluxo conforme o estado atual.
        if (!this.usuario.trim() || !this.senha) return;
        this.erro.set('');
        this.carregando.set(true);
        this.auth.login(this.usuario, this.senha)
            .pipe(finalize(() => this.carregando.set(false)))
            // Inicia a chamada assíncrona e trata o resultado quando ele chegar.
            .subscribe({
                next: () => void this.router.navigateByUrl('/'),
                error: () => this.erro.set('Usuário ou senha inválidos.')
            });
    }
}
