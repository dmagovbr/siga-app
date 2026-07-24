import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';
import { OperacoesListaComponent } from './pages/operacoes/lista/operacoes-lista.component';
import { OperacaoCadastroComponent } from './pages/operacoes/cadastro/operacao-cadastro.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Acesso | SIGA Crim' },
  { path: '', component: HomeComponent, canActivate: [authGuard], title: 'Início | SIGA Crim' },
  { path: 'operacoes/lista', component: OperacoesListaComponent, canActivate: [authGuard], title: 'Gestão de Operações | SIGA Crim' },
  { path: 'operacoes/cadastrar', component: OperacaoCadastroComponent, canActivate: [authGuard], title: 'Cadastro de Operações | SIGA Crim' },
  { path: 'operacoes/gestao', redirectTo: 'operacoes/lista', pathMatch: 'full' },
  { path: 'eventos/lista', component: PlaceholderComponent, canActivate: [authGuard], title: 'Gestão de Eventos | SIGA Crim', data: { grupo: 'Eventos', titulo: 'Gestão de Eventos', descricao: 'Consulta e acompanhamento dos eventos cadastrados.' } },
  { path: 'eventos/cadastrar', component: PlaceholderComponent, canActivate: [authGuard], title: 'Cadastro de Eventos | SIGA Crim', data: { grupo: 'Eventos', titulo: 'Cadastro de Eventos', descricao: 'Cadastro inicial de eventos no sistema.' } },
  { path: 'eventos/gestao', redirectTo: 'eventos/lista', pathMatch: 'full' },
  { path: 'administracao/usuarios', component: PlaceholderComponent, canActivate: [authGuard], title: 'Usuários | SIGA Crim', data: { grupo: 'Administrativo', titulo: 'Usuários', descricao: 'Gestão de usuários e vínculos organizacionais.' } },
  { path: 'administracao/perfis', component: PlaceholderComponent, canActivate: [authGuard], title: 'Perfis | SIGA Crim', data: { grupo: 'Administrativo', titulo: 'Perfis', descricao: 'Gestão de perfis de acesso.' } },
  { path: '**', redirectTo: '' }
];
