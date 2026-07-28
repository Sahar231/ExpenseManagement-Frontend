import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login';
import { SignupComponent } from './pages/auth/signup/signup';
import { sidebarComponent } from './pages/sidebar/sidebar';
import { ListeComponent } from './pages/frais/liste/liste';
import { ValidationComponent } from './pages/frais/validation/validation';
import { TableauDeBord } from './pages/tableau-de-bord/tableau-de-bord';
import { authGuard } from './core/services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: 'sidebar', 
    component: sidebarComponent,
    canActivate: [authGuard],
    children: [
      { path: 'frais/liste', component: ListeComponent },
      { path: 'frais/validation', component: ValidationComponent },
      { path: 'tableau-de-bord', component: TableauDeBord }
    ]
  },
  { path: '**', redirectTo: 'login' }
];