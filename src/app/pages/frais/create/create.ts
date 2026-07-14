import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-frais-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class FraisCreateComponent implements OnInit {
  
  // Structure du formulaire liée exactement au [(ngModel)] du HTML
  formModel = {
    missionId: 0, // Initialisé à 0 comme dans : [disabled]="formModel.missionId === 0"
    categorie: 'Repas', // Valeur par défaut initiale
    montant: null,
    date: '',
    commentaire: ''
  };

  // Tableau qui alimente le *ngFor="let m of missions" du HTML
  missions: any[] = [];
  
  loading = false;
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.chargerMissions();
  }

  // Charger dynamiquement les missions depuis le backend .NET
  chargerMissions(): void {
    this.http.get<any[]>('https://localhost:7212/api/missions').subscribe({
      next: (data) => {
        this.missions = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des missions', err);
      }
    });
  }

  // Cette méthode correspond exactement au (ngSubmit)="registrarFrais()" de ton HTML
  registrarFrais(): void {
    this.loading = true;
    this.errorMessage = '';

    // ÉTAPE CRUCIALE : Préparation du Payload en camelCase avec forçage des types numériques
    const payload = {
      missionId: Number(this.formModel.missionId), // string/number -> int strict pour .NET
      categorie: this.formModel.categorie,
      montant: Number(this.formModel.montant),     // string/number -> decimal pour .NET
      date: this.formModel.date,                   // Format attendu: "YYYY-MM-DD"
      commentaire: this.formModel.commentaire || null
    };

    // Envoi de la requête POST vers le ExpensesController révisé
    this.http.post('https://localhost:7212/api/expenses', payload).subscribe({
      next: (response: any) => {
        this.loading = false;
        alert(response.message || "Frais enregistré en Brouillon avec succès !");
        
        // Redirection vers la liste des frais après création
        this.router.navigate(['/dashboard/frais/liste']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Détails de l\'erreur :', err);
        
        // Extraction du message renvoyé par le backend
        const backendMessage = err?.error?.message || err?.error?.details || err?.message || "Une erreur est survenue lors de l'enregistrement.";
        this.errorMessage = backendMessage;
        alert("Erreur lors de la création : " + backendMessage);
      }
    });
  }

  // Cette méthode correspond exactement au (click)="reinitialiserFormulaire()" de ton HTML
  reinitialiserFormulaire(): void {
    this.formModel = {
      missionId: 0,
      categorie: 'Repas',
      montant: null,
      date: '',
      commentaire: ''
    };
    this.errorMessage = '';
  }
}