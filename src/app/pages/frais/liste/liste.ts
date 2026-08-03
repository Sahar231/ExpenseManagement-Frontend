import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FraisService } from '../../../core/services/frais';

declare var bootstrap: any;

export interface Mission {
  id: number;
  nom: string;
}

export interface Approval {
  statut: string;
  commentaire?: string;
}

export interface FraisItem {
  id: number;
  missionId?: number;
  missionNom?: string;
  categorie: string;
  montant: number;
  date: string;
  statut: string;
  commentaire?: string;
  managerNom?: string;
  managerPrenom?: string;
  motifRejet?: string;
  dernierCommentaire?: string;
  approvals?: Approval[];
}

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liste.html',
  styleUrls: ['./liste.css']
})
export class ListeComponent implements OnInit, OnDestroy {
  @ViewChild('detailsModalRef') detailsModalRef!: ElementRef;

  mesFrais: FraisItem[] = [];
  mesFraisFiltres: FraisItem[] = [];
  missions: Mission[] = [];

  // Filtres
  fraisRecherche: string = '';
  statutFiltre: string = '';
  todayDate: string = new Date().toISOString().split('T')[0];

  // Options de tri
  sortOption: string = 'date-desc';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 8;

  // Modales & Sélection
  fraisToCreate: Partial<FraisItem> = {};
  fraisToEdit: Partial<FraisItem> = {};
  idToDelete: number | null = null;
  selectedFrais: FraisItem | null = null;

  // --- ALERTE DE SUCCÈS SIMPLE ---
  successMessage: string | null = null;
  private alertTimeout: any;

  private lastActiveElement: HTMLElement | null = null;
  private modalHiddenListener: (() => void) | null = null;

  constructor(
    private fraisService: FraisService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerFrais();
    this.chargerMissions();
    this.setupModalFocusListener();
  }

  ngOnDestroy(): void {
    const element = document.getElementById('detailsModal');
    if (element && this.modalHiddenListener) {
      element.removeEventListener('hidden.bs.modal', this.modalHiddenListener);
    }
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
  }

  // --- HELPER ALERTE SUCCÈS ---
  afficherSucces(msg: string): void {
    this.successMessage = msg;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 3500);
  }

  // --- CHARGEMENT DES DONNÉES ---
  chargerFrais(): void {
    this.fraisService.getMesFrais().subscribe({
      next: (data) => {
        this.mesFrais = data || [];
        this.appliquerFiltresEtTri();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement des frais:', err)
    });
  }

  chargerMissions(): void {
    this.fraisService.getMissions().subscribe({
      next: (data) => {
        this.missions = data || [];
      },
      error: (err) => console.error('Erreur chargement des missions:', err)
    });
  }

  // --- FILTRES & TRI ---
  filtrerParStatut(statut: string): void {
    this.statutFiltre = statut;
    this.appliquerFiltresEtTri();
  }

  changerTriOption(): void {
    this.appliquerFiltresEtTri();
  }

  appliquerFiltresEtTri(): void {
    let result = [...this.mesFrais];

    // 1. Recherche globale
    if (this.fraisRecherche.trim() !== '') {
      const recherche = this.fraisRecherche.toLowerCase();
      result = result.filter(f =>
        f.missionNom?.toLowerCase().includes(recherche) ||
        f.categorie?.toLowerCase().includes(recherche) ||
        f.statut?.toLowerCase().includes(recherche) ||
        f.montant?.toString().includes(recherche)
      );
    }

    // 2. Filtre par statut
    if (this.statutFiltre !== '') {
      if (this.statutFiltre === 'Soumis') {
        result = result.filter(f => f.statut === 'Soumis' || f.statut === 'En attente');
      } else if (this.statutFiltre === 'Approved') {
        result = result.filter(f => f.statut === 'Approved' || f.statut === 'Approuvé');
      } else if (this.statutFiltre === 'Rejected') {
        result = result.filter(f => f.statut === 'Rejected' || f.statut === 'Rejeté');
      } else {
        result = result.filter(f => f.statut === this.statutFiltre);
      }
    }

    // 3. Tri
    result.sort((a, b) => {
      switch (this.sortOption) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'montant-desc':
          return b.montant - a.montant;
        case 'montant-asc':
          return a.montant - b.montant;
        default:
          return 0;
      }
    });

    this.mesFraisFiltres = result;
    this.currentPage = 1;
  }

  // --- PAGINATION ---
  get paginatedFrais(): FraisItem[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.mesFraisFiltres.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.mesFraisFiltres.length / this.pageSize) || 1;
  }

  changerPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // --- MODALES BOOTSTRAP ---
  private showModal(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      const modal = bootstrap.Modal.getOrCreateInstance(element);
      modal.show();
    }
  }

  private hideModal(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      const modal = bootstrap.Modal.getInstance(element);
      modal?.hide();
    }
  }

  private setupModalFocusListener(): void {
    setTimeout(() => {
      const element = document.getElementById('detailsModal');
      if (element) {
        this.modalHiddenListener = () => {
          if (this.lastActiveElement) {
            this.lastActiveElement.focus();
            this.lastActiveElement = null;
          }
        };
        element.addEventListener('hidden.bs.modal', this.modalHiddenListener);
      }
    });
  }

  // --- ACTIONS ---
  openCreateModal(): void {
    this.fraisToCreate = { missionId: 0, categorie: 'Repas', montant: undefined, date: '', commentaire: '' };
    this.showModal('createModal');
  }

  modifier(f: FraisItem): void {
    this.fraisToEdit = { 
      ...f,
      date: f.date ? new Date(f.date).toISOString().split('T')[0] : ''
    };
    this.showModal('editModal');
  }

  voir(id: number): void {
    this.lastActiveElement = document.activeElement as HTMLElement;

    this.fraisService.getDetails(id).subscribe({
      next: (data) => {
        this.selectedFrais = data;
        this.cdr.detectChanges();
        this.showModal('detailsModal');
      },
      error: (err) => console.error('Erreur chargement détails:', err)
    });
  }

  openDeleteModal(id: number): void {
    this.idToDelete = id;
    this.showModal('deleteModal');
  }

  saveCreate(): void {
    this.fraisService.creerFrais(this.fraisToCreate).subscribe(() => {
      this.chargerFrais();
      this.hideModal('createModal');
      this.afficherSucces('🎉 Note de frais ajoutée avec succès !');
    });
  }

  saveEdit(): void {
    if (this.fraisToEdit.id) {
      this.fraisService.modifier(this.fraisToEdit.id, this.fraisToEdit).subscribe(() => {
        this.chargerFrais();
        this.hideModal('editModal');
        this.afficherSucces('✏️ Note de frais mise à jour avec succès !');
      });
    }
  }

  soumettre(id: number): void {
    this.fraisService.soumettre(id).subscribe(() => {
      this.chargerFrais();
      this.afficherSucces('🚀 Note de frais soumise avec succès !');
    });
  }

  confirmDelete(): void {
    if (this.idToDelete) {
      this.fraisService.supprimer(this.idToDelete).subscribe(() => {
        this.chargerFrais();
        this.hideModal('deleteModal');
        this.afficherSucces('🗑️ Note de frais supprimée avec succès !');
      });
    }
  }

  // --- HELPER DÉTAILS ---
  getDernierCommentaireRejet(): string {
    if (!this.selectedFrais) return 'Aucun motif précisé.';

    if (this.selectedFrais.motifRejet) return this.selectedFrais.motifRejet;
    if (this.selectedFrais.dernierCommentaire) return this.selectedFrais.dernierCommentaire;

    if (Array.isArray(this.selectedFrais.approvals)) {
      const rejet = this.selectedFrais.approvals
        .filter(a => a.statut === 'Rejected' || a.statut === 'Rejeté')
        .pop();
      if (rejet?.commentaire) return rejet.commentaire;
    }

    return 'Aucun motif précisé.';
  }
}