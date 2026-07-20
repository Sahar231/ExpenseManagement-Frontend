import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FraisService } from '../../../core/services/frais';

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
  selectedFrais: any = null;
  fraisAsearch: string ='';

  constructor(private fraisService: FraisService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.chargerFrais();
  }

  chargerFrais(): void {
    // Appel à ton API corrigée (tous statuts)
    this.fraisService.getFraisAValider().subscribe({
      next: (data: any[]) => {
        this.fraisAValider = data;
        this.cdr.detectChanges();
      }
    });
  }

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

  voir(id: number) {
    this.fraisService.getDetails(id).subscribe(data => {
      this.selectedFrais = data;
      
      // 1. Détection des changements pour que la data soit dans le DOM
      this.cdr.detectChanges(); 

      // 2. Sécurisation de l'accès au DOM
      const modalElement = document.getElementById('detailsModal');
      
      if (modalElement) {
        // Utilisation de la méthode native Bootstrap en toute sécurité
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
      } else {
        console.error("L'élément modal 'detailsModal' est introuvable dans le HTML.");
      }
    });
  }
}