import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Cette méthode correspond exactement au (ngSubmit)="onSubmit(loginForm)" de ton HTML
  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    // Appel du service d'authentification
    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (response: any) => {
        this.loading = false;

        // ÉTAPE CRUCIALE : On sauvegarde le Token JWT et les infos de l'utilisateur reçus du Backend .NET
        this.authService.saveSessionFromResponse(response);

        // Redirection vers le formulaire de création (La route enfant exacte configurée dans app.routes.ts)
        this.router.navigate(['/dashboard/frais/create']);
      },
      error: (err) => {
        this.loading = false;
        // Affichage du message d'erreur retourné par le backend ou message générique
        this.errorMessage = err.error?.message || "Identifiants incorrects ou problème de connexion au serveur.";
      }
    });
  }
}