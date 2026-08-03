import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// 1. Guard mta3 el-Connexion (Login)
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// 2. Guard mta3 el-Rôle (Manager / Employé)
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Ejbed el-role el-matloub mel route config
  const requiredRole = route.data['role'] as string;

  if (authService.isLoggedIn() && authService.hasRole(requiredRole)) {
    return true; // Accès autorisé
  }

  // Refus d'accès : redirection lel Tableau de bord
  router.navigate(['/sidebar/tableau-de-bord']);
  return false;
};