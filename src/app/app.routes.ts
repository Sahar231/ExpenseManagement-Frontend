import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login';
import { SignupComponent } from './pages/auth/signup/signup'; // 1. Importez le composant Signup
import { DashboardComponent } from './pages/dashbord/dashbord';

import { ListeComponent } from './pages/frais/liste/liste';
import { ValidationComponent } from './pages/frais/validation/validation';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }, // 2. Ajoutez la route ici
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      
      { path: 'frais/liste', component: ListeComponent },
      { 
        path: 'frais/validation', 
        component: ValidationComponent
      }
    ]
  }
];