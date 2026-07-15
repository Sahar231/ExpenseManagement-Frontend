import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { FraisService } from '../../../core/services/frais';

declare var bootstrap: any;

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './liste.html'
})
export class ListeComponent implements OnInit {
  mesFrais: any[] = [];
  missions: any[] = [];
  
  // Objets pour les modales
  fraisToCreate: any = {};
  fraisToEdit: any = {};
  fraisToView: any = null;
  idToDelete: number | null = null;

  constructor(
    private fraisService: FraisService, 
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.chargerFrais();
    this.chargerMissions();
  }

  // --- CHARGEMENT ---
  chargerFrais() {
    this.fraisService.getMesFrais().subscribe({
      next: (data) => {
        this.mesFrais = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Erreur chargement frais', err)
    });
  }

  chargerMissions() {
    this.fraisService.getMissions().subscribe({
      next: (data) => {
        this.missions = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Erreur chargement missions', err)
    });
  }

  // --- CRÉATION ---
  openCreateModal() {
    this.fraisToCreate = { 
      missionId: 0, 
      categorie: 'Repas', 
      montant: null, 
      date: '', 
      commentaire: '' 
    };
    const modal = new bootstrap.Modal(document.getElementById('createModal'));
    modal.show();
  }

  saveCreate() {
    this.fraisService.creerFrais(this.fraisToCreate).subscribe({
      next: () => {
        this.chargerFrais();
        bootstrap.Modal.getInstance(document.getElementById('createModal')).hide();
      },
      error: (err) => alert('Erreur : ' + (err.error?.message || 'Action impossible'))
    });
  }

  // --- MODIFICATION ---
  modifier(f: any) {
    this.fraisToEdit = { ...f };
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  }

  saveEdit() {
    this.fraisService.modifier(this.fraisToEdit.id, this.fraisToEdit).subscribe({
      next: () => {
        this.chargerFrais();
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
      },
      error: (err) => alert('Erreur : ' + (err.error?.message || 'Action impossible'))
    });
  }
  
  // --- DÉTAILS ---
  voirDetails(f: any) {
    this.fraisToView = { ...f };
    const modal = new bootstrap.Modal(document.getElementById('viewModal'));
    modal.show();
  }

  // --- SUPPRESSION ---
  openDeleteModal(id: number) {
    this.idToDelete = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }

  confirmDelete() {
    if (this.idToDelete) {
      this.fraisService.supprimer(this.idToDelete).subscribe({
        next: () => {
          this.chargerFrais();
          bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        },
        error: (err) => alert('Erreur : ' + (err.error?.message || 'Action impossible'))
      });
    }
  }

  // --- SOUMISSION ---
  soumettre(id: number) {
    this.fraisService.soumettre(id).subscribe({
      next: () => {
        alert('Frais soumis avec succès !');
        this.chargerFrais();
      },
      error: (err) => alert('Erreur : ' + (err.error?.message || 'Action impossible'))
    });
  }
}