import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login';
import { DashboardComponent } from './pages/dashbord/dashbord';
import { FraisCreateComponent } from './pages/frais/create/create';
import { ListeComponent } from './pages/frais/liste/liste';
import { ValidationComponent } from './pages/frais/validation/validation'; // 1. Importez le composant

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: 'frais/create', component: FraisCreateComponent },
      { path: 'frais/liste', component: ListeComponent },
      { 
        path: 'frais/validation', 
        component: ValidationComponent,
        // canActivate: [authGuard] // Ajoutez votre guard ici pour la sécurité
      }
    ]
  }
];