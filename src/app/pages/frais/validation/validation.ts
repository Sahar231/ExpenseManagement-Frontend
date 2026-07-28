import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FraisService } from '../../../core/services/frais';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validation.html',
  styleUrls: ['./validation.css']
})
export class ValidationComponent implements OnInit {
  fraisAValider: any[] = [];
  fraisA: any[] = [];
  fraisEnCoursDeRejet: number | null = null;
  motif: string = '';
  fraisAserach: string = '';
  critereTri: string = 'date-desc';
  filtreStatutPill: string = 'ALL'; // Var lil filter pills

  constructor(private fraisService: FraisService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.chargerFrais();
  }

  chargerFrais(): void {
    this.fraisService.getFraisAValider().subscribe({
      next: (data: any[]) => {
        this.fraisAValider = data;
        this.filtrerEtTrier();
        this.cdr.detectChanges();
      }
    });
  }

  filtrerParPill(statut: string): void {
    this.filtreStatutPill = statut;
    this.filtrerEtTrier();
  }

  filtrerEtTrier(): void {
    const recherche = this.fraisAserach.toLowerCase().trim();

    // 1. Filtrage par texte et par Pill Filter Expensify
    this.fraisA = this.fraisAValider.filter(f => {
      const matchText = !recherche || (
        f.employeeNom?.toLowerCase().includes(recherche) ||
        f.employeePrenom?.toLowerCase().includes(recherche) ||
        f.missionNom?.toLowerCase().includes(recherche) ||
        f.categorie?.toLowerCase().includes(recherche) ||
        f.statut?.toLowerCase().includes(recherche)
      );

      const matchPill = this.filtreStatutPill === 'ALL' || f.statut === this.filtreStatutPill;

      return matchText && matchPill;
    });

    // 2. Tri
    this.trierFrais();
  }

  trierFrais(): void {
    this.fraisA.sort((a, b) => {
      if (this.critereTri === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (this.critereTri === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (this.critereTri === 'statut') {
        return a.statut.localeCompare(b.statut);
      }
      return 0;
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
}