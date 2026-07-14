import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth'; // Chemin vérifié par rapport à ton dossier

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashbord.html',
  styleUrls: ['./dashbord.css']
})
export class DashboardComponent implements OnInit {
  isExpensesOpen = false;
  
  // Variables d'affichage dynamiques
  userRole = '';
  userName = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.chargerProfilUtilisateur();
  }
  

  // Chargement des informations utilisateur reçues via l'authentification JWT
  chargerProfilUtilisateur(): void {
    const currentUser = this.authService.getUserData();

    if (currentUser) {
      // Combinaison du Prénom et Nom pour l'affichage de la Navbar
      this.userName = `${currentUser.prenom} ${currentUser.nom}`;
      this.userRole = currentUser.role; // Récupère 'Manager' ou 'Employé'
    } else {
      // Sécurité : Si aucune donnée utilisateur n'existe, déconnexion forcée
      this.onLogout();
    }
  }

  // Gestion de l'affichage du sous-menu Expenses dans la Sidebar
  toggleExpenses(): void {
    this.isExpensesOpen = !this.isExpensesOpen;
  }

  // Action de déconnexion sécurisée (Cahier des charges du projet)
  onLogout(): void {
    this.authService.logout(); // Nettoie le token et l'utilisateur du localStorage
    this.router.navigate(['/login']); // Redirection immédiate vers l'interface de connexion
  }
}