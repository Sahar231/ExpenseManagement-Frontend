import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login';
import { DashboardComponent } from './pages/dashbord/dashbord';
import { FraisCreateComponent } from './pages/frais/create/create';
import { ListeComponent } from './pages/frais/liste/liste';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, // C'est ici que ta Sidebar habite
    children: [
      { path: 'frais/create', component: FraisCreateComponent },
      { path: 'frais/liste', component: ListeComponent }
    ]
  }
];