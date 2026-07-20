import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { FraisService } from '../../core/services/frais';
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
  isManager: boolean = false;

  constructor(
    private fraisService: FraisService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerStatistiques();
  }

  chargerStatistiques() {
    this.fraisService.getStatistiques().subscribe({
      next: (data) => {
        this.statistiques = data;

        this.isManager = data.repartitionEmployes && data.repartitionEmployes.length > 0;
        this.cdr.detectChanges();
        this.mettreAJourGraphique();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques', err);
      }
    });
  }

  changerModeFiltre() {
    this.mettreAJourGraphique();
  }

  mettreAJourGraphique() {
    if (!this.statistiques) return;

    let datasetSource: any[] = [];
    let titreLabel = '';

    if (this.modeFiltre === 'statut') {
      datasetSource = this.statistiques.repartitionStatuts;
      titreLabel = 'Par Statut';
    } else if (this.modeFiltre === 'mission') {
      datasetSource = this.statistiques.repartitionMissions;
      titreLabel = 'Par Mission';
    } else if (this.modeFiltre === 'employe') {
      datasetSource = this.statistiques.repartitionEmployes;
      titreLabel = 'Par Employé';
    }

    const labels = datasetSource.map(item => item.label);
    const valeurs = datasetSource.map(item => item.nombre);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('statutChart', {
      type: 'pie', 
      data: {
        labels: labels,
        datasets: [{
          label: titreLabel,
          data: valeurs,
          backgroundColor: ['#ffc107', '#198754', '#dc3545', '#0dcaf0', '#6f42c1', '#fd7e14'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
       
    }});
  }
}