import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Acesso | SIGACrim' },
  { path: '', component: HomeComponent, canActivate: [authGuard], title: 'Início | SIGACrim' },
  { path: 'operacoes/lista', component: PlaceholderComponent, canActivate: [authGuard], data: { grupo: 'Operações', titulo: 'Lista de Operações', descricao: 'Consulta e acompanhamento das operações cadastradas.' } },
  { path: 'operacoes/gestao', component: PlaceholderComponent, canActivate: [authGuard], data: { grupo: 'Operações', titulo: 'Gestão', descricao: 'Cadastro e gestão do ciclo de vida das operações.' } },
  { path: 'eventos/lista', component: PlaceholderComponent, canActivate: [authGuard], data: { grupo: 'Eventos', titulo: 'Lista de Operações', descricao: 'Consulta dos registros vinculados ao módulo de eventos.' } },
  { path: 'eventos/gestao', component: PlaceholderComponent, canActivate: [authGuard], data: { grupo: 'Eventos', titulo: 'Gestão', descricao: 'Cadastro e gestão de eventos.' } },
  { path: 'administracao/usuarios', component: PlaceholderComponent, canActivate: [authGuard], data: { grupo: 'Administração', titulo: 'Usuários', descricao: 'Gestão de usuários e vínculos organizacionais.' } },
  { path: 'administracao/perfis', component: PlaceholderComponent, canActivate: [authGuard], data: { grupo: 'Administração', titulo: 'Perfis', descricao: 'Gestão de perfis de acesso.' } },
  { path: '**', redirectTo: '' }
];
