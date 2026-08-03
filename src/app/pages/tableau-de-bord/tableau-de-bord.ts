import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { FraisService } from '../../core/services/frais';
import { AuthService } from '../../core/services/auth'; // 👈 Assure-toi du bon chemin d'import
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tableau-de-bord.html',
  styleUrls: ['./tableau-de-bord.css']
})
export class TableauDeBord implements OnInit {
  statistiques: any = null;
  chart: any = null;
  modeFiltre: string = 'statut';
  
  // Variables de gestion de rôle
  userRole: string = '';
  isManager: boolean = false;

  constructor(
    private fraisService: FraisService,
    private authService: AuthService, // 👈 Injecté pour vérifier le rôle de l'utilisateur
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 1. Récupération du rôle connecté (depuis AuthService ou directement localStorage)
    this.userRole = this.authService?.getUserRole() || localStorage.getItem('userRole') || '';
    
    // 2. Vérification si c'est un Manager (s'adapte à 'Manager', 'ADMIN', etc.)
    this.isManager = this.userRole.toLowerCase() === 'manager' || this.userRole.toLowerCase() === 'admin';

    // 3. Charger les données du tableau de bord
    this.chargerStatistiques();
  }

  chargerStatistiques() {
    this.fraisService.getStatistiques().subscribe({
      next: (data) => {
        this.statistiques = data;

        // Double vérification au cas où l'API backend définit le rôle
        if (!this.isManager && data.repartitionEmployes && data.repartitionEmployes.length > 0) {
          this.isManager = true;
        }

        this.cdr.detectChanges();
        this.mettreAJourGraphique();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques', err);
      }
    });
  }

  changerModeFiltre() {
    // 🛡️ Sécurité : Si un simple employé tente de forcer le filtre "employe", on le bloque
    if (this.modeFiltre === 'employe' && !this.isManager) {
      this.modeFiltre = 'statut';
    }
    
    this.mettreAJourGraphique();
  }

  getPourcentage(approuve: number, total: number): number {
    if (!total || total === 0) return 0;
    return Math.round((approuve / total) * 100);
  }

  mettreAJourGraphique() {
    if (!this.statistiques) return;

    let datasetSource: any[] = [];
    let titreLabel = '';

    // Sélection des données selon le filtre actif
    if (this.modeFiltre === 'statut') {
      datasetSource = this.statistiques.repartitionStatuts || [];
      titreLabel = 'Par Statut';
    } else if (this.modeFiltre === 'mission') {
      datasetSource = this.statistiques.repartitionMissions || [];
      titreLabel = 'Par Mission';
    } else if (this.modeFiltre === 'employe' && this.isManager) {
      datasetSource = this.statistiques.repartitionEmployes || [];
      titreLabel = 'Par Employé';
    }

    const labels = datasetSource.map(item => item.label);
    const valeurs = datasetSource.map(item => item.nombreFrais || item.nombre);

    // Détruire l'ancien graphique avant de créer le nouveau
    if (this.chart) {
      this.chart.destroy();
    }

    // Création du Doughnut Chart avec un style moderne
    this.chart = new Chart('statutChart', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: titreLabel,
          data: valeurs,
          backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#8b5cf6', '#f97316'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              font: { family: 'Inter', size: 12 }
            }
          }
        },
        cutout: '70%'
      }
    });
  }
}