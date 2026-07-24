import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';
import { OperacoesListaComponent } from './pages/operacoes/lista/operacoes-lista.component';
import { EventosListaComponent } from './pages/eventos/lista/eventos-lista.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Acesso | SIGACrim' },
  { path: '', component: HomeComponent, canActivate: [authGuard], title: 'Início | SIGACrim' },

  { path: 'operacoes/cadastros', component: OperacoesListaComponent, canActivate: [authGuard], title: 'Cadastros de Operações | SIGACrim' },
  { path: 'operacoes/cadastrar', redirectTo: 'operacoes/cadastros', pathMatch: 'full' },
  { path: 'operacoes/lista', redirectTo: 'operacoes/cadastros', pathMatch: 'full' },
  { path: 'operacoes/gestao', component: PlaceholderComponent, canActivate: [authGuard], title: 'Gestão de Operações | SIGACrim', data: { titulo: 'Gestão de Operações' } },

  { path: 'eventos/cadastros', component: EventosListaComponent, canActivate: [authGuard], title: 'Cadastros de Eventos | SIGACrim' },
  { path: 'eventos/cadastrar', redirectTo: 'eventos/cadastros', pathMatch: 'full' },
  { path: 'eventos/lista', redirectTo: 'eventos/cadastros', pathMatch: 'full' },
  { path: 'eventos/gestao', component: PlaceholderComponent, canActivate: [authGuard], title: 'Gestão de Eventos | SIGACrim', data: { titulo: 'Gestão de Eventos' } },

  { path: 'administracao/usuarios', component: PlaceholderComponent, canActivate: [authGuard], title: 'Usuários | SIGACrim', data: { titulo: 'Usuários' } },
  { path: 'administracao/perfis', component: PlaceholderComponent, canActivate: [authGuard], title: 'Perfis | SIGACrim', data: { titulo: 'Perfis' } },
  { path: '**', redirectTo: '' }
];
