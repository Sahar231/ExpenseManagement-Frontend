import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { FraisService } from '../../../core/services/frais';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './liste.html'
})
export class ListeComponent implements OnInit, OnDestroy {
  @ViewChild('detailsModalRef') detailsModalRef!: ElementRef;
  
  mesFrais: any[] = [];
  missions: any[] = [];
  fraisRecherche: string = '';
mesFraisFiltres: any[] = [];
  fraisToCreate: any = {};
  fraisToEdit: any = {};
  idToDelete: number | null = null;
  selectedFrais: any = null;

  // Track the element that opened the modal to restore focus later
  private lastActiveElement: HTMLElement | null = null;
  private modalHiddenListener: (() => void) | null = null;

  constructor(private fraisService: FraisService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.chargerFrais();
    this.chargerMissions();
    this.setupModalFocusListener();
  }

  ngOnDestroy() {
    // Cleanup vanilla event listeners to prevent memory leaks
    const element = document.getElementById('detailsModal');
    if (element && this.modalHiddenListener) {
      element.removeEventListener('hidden.bs.modal', this.modalHiddenListener);
    }
  }
  filtrerFrais(): void {

  const recherche = this.fraisRecherche.toLowerCase();

  if (recherche === '') {
    this.mesFraisFiltres = this.mesFrais;
    return;
  }

  this.mesFraisFiltres = this.mesFrais.filter(f => {

    return (
      f.employeeNom?.toLowerCase().includes(recherche) ||
      f.employeePrenom?.toLowerCase().includes(recherche) ||
      f.missionNom?.toLowerCase().includes(recherche) ||
      f.categorie?.toLowerCase().includes(recherche) ||
      f.statut?.toLowerCase().includes(recherche)
    );

  });

}

  // --- FOCUS RESTORATION SETUP ---
  private setupModalFocusListener() {
    // We wait for the modal element to exist in the DOM
    setTimeout(() => {
      const element = document.getElementById('detailsModal');
      if (element) {
        this.modalHiddenListener = () => {
          // Restore focus to the original trigger button once modal is completely hidden
          if (this.lastActiveElement) {
            this.lastActiveElement.focus();
            this.lastActiveElement = null; // Clear tracking
          }
        };
        element.addEventListener('hidden.bs.modal', this.modalHiddenListener);
      }
    });
  }

  // --- CHARGEMENT ---
  chargerFrais() {
    this.fraisService.getMesFrais().subscribe(data => {
      this.mesFrais = data;
      this.cdr.detectChanges();
    });
  }

  chargerMissions() {
    this.fraisService.getMissions().subscribe(data => {
      this.missions = data;
    });
  }

  // --- LOGIQUE DES MODALES ---
  private showModal(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const modal = bootstrap.Modal.getOrCreateInstance(element);
      modal.show();
    }
  }

  private hideModal(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const modal = bootstrap.Modal.getInstance(element);
      modal?.hide();
    }
  }
 
  // --- ACTIONS ---
  openCreateModal() {
    this.fraisToCreate = { missionId: 0, categorie: 'Repas', montant: null, date: '', commentaire: '' };
    this.showModal('createModal');
  }

  modifier(f: any) {
    this.fraisToEdit = { ...f };
    this.showModal('editModal');
  }

  voir(id: number) {
    // 1. Remember the element (the "Voir" button) that was clicked
    this.lastActiveElement = document.activeElement as HTMLElement;

    // 2. Charger les données fraîches via votre service corrigé
    this.fraisService.getDetails(id).subscribe(data => {
      this.selectedFrais = data;
      this.cdr.detectChanges(); // Ensure Angular renders the data into the modal template first
      
      // 3. Ouvrir le modal une fois les données prêtes
      this.showModal('detailsModal');
    });
  }

  openDeleteModal(id: number) {
    this.idToDelete = id;
    this.showModal('deleteModal');
  }

  // --- SAUVEGARDE ---
  saveCreate() {
    this.fraisService.creerFrais(this.fraisToCreate).subscribe(() => {
      this.chargerFrais();
      this.hideModal('createModal');
    });
  }

  saveEdit() {
    this.fraisService.modifier(this.fraisToEdit.id, this.fraisToEdit).subscribe(() => {
      this.chargerFrais();
      this.hideModal('editModal');
    });
  }

  soumettre(id: number) {
    this.fraisService.soumettre(id).subscribe(() => this.chargerFrais());
  }

  confirmDelete() {
    if (this.idToDelete) {
      this.fraisService.supprimer(this.idToDelete).subscribe(() => {
        this.chargerFrais();
        this.hideModal('deleteModal');
      });
    }
  }

  getDernierCommentaireRejet(): string {
    if (!this.selectedFrais?.approvals) return 'Aucun commentaire.';
    const rejet = this.selectedFrais.approvals.filter((a: any) => a.statut === 'Rejected').pop();
    return rejet ? rejet.commentaire : 'Aucun motif précisé.';
  }
}