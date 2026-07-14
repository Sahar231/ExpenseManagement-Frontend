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
  fraisToEdit: any = {};
  idToDelete: number | null = null;
  missions: any[] = [];
  fraisToView: any = {};

  constructor(
    private fraisService: FraisService, 
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.chargerFrais();
    this.chargerMissions();
    
  }

  chargerFrais() {
    this.fraisService.getMesFrais().subscribe({
      next: (data) => {
        this.mesFrais = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Erreur chargement', err)
    });
  }
  chargerMissions() {
  this.fraisService.getMissions().subscribe({
      next: (data) => {
        this.missions = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Erreur chargement', err)
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
  
voirDetails(f: any) {
  this.fraisToView = { ...f };
  console.log(this.fraisToView);

  const modalElement = document.getElementById('viewModal');
  console.log(modalElement);

  const modal = new bootstrap.Modal(modalElement);
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

  // Helpers pour les boutons
  isModifierDisabled(statut: string): boolean { return !['Brouillon', 'Rejeté'].includes(statut); }
  isSupprimerDisabled(statut: string): boolean { return statut !== 'Brouillon'; }
  isSoumettreDisabled(statut: string): boolean { return !['Brouillon', 'Rejeté'].includes(statut); }
  


}