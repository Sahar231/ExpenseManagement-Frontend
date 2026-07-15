
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { FraisService } from '../../../core/services/frais';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './liste.html'
})
export class ListeComponent implements OnInit {
  @ViewChild('detailsModalRef') detailsModalRef!: ElementRef;
  mesFrais: any[] = [];
  missions: any[] = [];
  
  // Objets pour les modales
  fraisToCreate: any = {};
  fraisToEdit: any = {};
  fraisToView: any = null;
  idToDelete: number | null = null;
   selectedFrais: any = null;
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

  

  // --- MODIFICATION ---
  modifier(f: any) {
    this.fraisToEdit = { ...f };
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
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

  

  
  // --- CRÉATION ---
saveCreate() {
  this.fraisService.creerFrais(this.fraisToCreate).subscribe({
    next: () => {
      this.chargerFrais();
      bootstrap.Modal.getInstance(document.getElementById('createModal')).hide();
      alert('Succès : Votre frais a été enregistré en tant que brouillon.');
    },
    error: (err) => alert('Erreur : ' + (err.error?.message || 'Impossible de créer le frais'))
  });
}

// --- MODIFICATION ---
saveEdit() {
  this.fraisService.modifier(this.fraisToEdit.id, this.fraisToEdit).subscribe({
    next: () => {
      this.chargerFrais();
      bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
      alert('Succès : La modification de votre frais a été enregistrée.');
    },
    error: (err) => alert('Erreur : ' + (err.error?.message || 'Modification impossible'))
  });
}

// --- SOUMISSION ---
soumettre(id: number) {
  this.fraisService.soumettre(id).subscribe({
    next: () => {
      this.chargerFrais();
      alert('Succès : Votre frais a été soumis avec succès et est en attente de validation par le manager.');
    },
    error: (err) => alert('Erreur : ' + (err.error?.message || 'La soumission a échoué'))
  });
}

// --- SUPPRESSION ---
confirmDelete() {
  if (this.idToDelete) {
    this.fraisService.supprimer(this.idToDelete).subscribe({
      next: () => {
        this.chargerFrais();
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        alert('Succès : Le frais a été supprimé de votre liste.');
      },
      error: (err) => alert('Erreur : ' + (err.error?.message || 'Suppression impossible'))
    });
  }
}


voir(id: number) {
  this.fraisService.getDetailsFrais(id).subscribe({
    next: (data) => {
      this.selectedFrais = data;
      // Utilise la référence ici
      const modal = new bootstrap.Modal(this.detailsModalRef.nativeElement);
      modal.show();
    },
    error: (err) => console.error('Erreur chargement détails', err)
  });
}

// Récupérer le dernier commentaire de rejet depuis Approvals
getDernierCommentaireRejet(): string {
  if (!this.selectedFrais?.approvals) return 'Aucun commentaire.';
  const rejet = this.selectedFrais.approvals
    .filter((a: any) => a.status === 'Rejected')
    .pop();
  return rejet ? rejet.comment : 'Aucun motif précisé.';
}
}