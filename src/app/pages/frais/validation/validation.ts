import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- AJOUTE CECI
import { FraisService } from '../../../core/services/frais';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, FormsModule], // <--- AJOUTE FormsModule ICI
  templateUrl: './validation.html'
})
export class ValidationComponent implements OnInit {
  fraisAValider: any[] = [];
  fraisEnCoursDeRejet: number | null = null;
  motif: string = '';

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

  approuver(id: number): void {
    this.fraisService.approuverFrais(id).subscribe({
      next: () => {
        this.chargerFrais();
        alert('Succès : Le frais a été approuvé.');
      },
      error: (err) => alert('Erreur : ' + (err.error?.message || 'Impossible d\'approuver'))
    });
  }

  rejeter(id: number): void {
    this.fraisEnCoursDeRejet = id;
    this.motif = '';
  }

  confirmerRejet(): void {
    if (!this.motif || this.motif.trim() === '') {
      alert("Le motif est obligatoire.");
      return;
    }

    this.fraisService.rejeterFrais(this.fraisEnCoursDeRejet!, this.motif).subscribe({
      next: () => {
        this.chargerFrais();
        this.annulerRejet();
      },
      error: (err) => alert('Erreur : ' + (err.error?.message || 'Impossible de rejeter'))
    });
  }

  annulerRejet(): void {
    this.fraisEnCoursDeRejet = null;
    this.motif = '';
  }

  voir(id: number): void {
    // Redirection vers une route de détails ou ouverture d'une modale
    console.log('Détails pour ID :', id);
  }
}