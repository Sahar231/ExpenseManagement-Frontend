import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FraisService } from '../../../core/services/frais';

// Déclaration pour Bootstrap
declare var bootstrap: any;

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validation.html'
})
export class ValidationComponent implements OnInit {
  fraisAValider: any[] = [];
  fraisEnCoursDeRejet: number | null = null;
  motif: string = '';
  
  // Variables nécessaires pour le modal
  selectedFrais: any = null;
  lastActiveElement: HTMLElement | null = null;

  constructor(
    private fraisService: FraisService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerFrais();
  }

  chargerFrais(): void {
    this.fraisService.getFraisAValider().subscribe({
      next: (data: any[]) => {
        this.fraisAValider = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // Méthode corrigée : vide avant de charger
  voir(id: number) {
    this.selectedFrais = null; // 1. VIDER pour éviter le mélange
    this.lastActiveElement = document.activeElement as HTMLElement;

    this.fraisService.getDetails(id).subscribe({
      next: (data) => {
        this.selectedFrais = data; // 2. Remplir avec les données fraîches
        this.cdr.detectChanges();
        this.showModal('detailsModal');
      },
      error: (err) => console.error("Erreur chargement détails", err)
    });
  }

  // --- LOGIQUE MODAL ---
  private showModal(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const modal = bootstrap.Modal.getOrCreateInstance(element);
      modal.show();
    }
  }

  // --- ACTIONS ---
  approuver(id: number): void {
    this.fraisService.approuverFrais(id).subscribe(() => this.chargerFrais());
  }

  rejeter(id: number): void {
    this.fraisEnCoursDeRejet = id;
    this.motif = '';
  }
  
  confirmerRejet(): void {
    if (!this.motif.trim()) return;
    this.fraisService.rejeterFrais(this.fraisEnCoursDeRejet!, this.motif).subscribe(() => {
      this.chargerFrais();
      this.annulerRejet();
    });
  }

  annulerRejet(): void {
    this.fraisEnCoursDeRejet = null;
    this.motif = '';
  }
}