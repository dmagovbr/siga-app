/** OBJETIVO DO ARQUIVO: Impede acesso a rotas privadas quando não existe sessão válida.
 * Os comentários explicam responsabilidades e pontos de decisão sem repetir sintaxe óbvia.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Exporta este contrato ou implementação para uso por outros módulos.
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  // Retorna o valor calculado sem manter estado oculto.
  return auth.autenticado() ? true : inject(Router).createUrlTree(['/login']);
};
