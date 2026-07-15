import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FraisService } from '../../../core/services/frais';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation.html'
})
export class ValidationComponent implements OnInit {

  fraisAValider: any[] = [];

  constructor(
    private fraisService: FraisService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ValidationComponent chargé');
    this.chargerFrais();
  }

  chargerFrais(): void {
    this.fraisService.getFraisAValider().subscribe({
      next: (data: any[]) => {
        console.log('API :', data);

        this.fraisAValider = data;

        console.log(
          'Longueur :',
          this.fraisAValider.length
        );

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  approuver(id: number): void {
    this.fraisService.approuverFrais(id).subscribe(() => {
      this.chargerFrais();
    });
  }

  rejeter(id: number): void {
    const commentaire = prompt('Motif du rejet');

    if (!commentaire) {
      return;
    }

    this.fraisService.rejeterFrais(id, commentaire)
      .subscribe(() => {
        this.chargerFrais();
      });
  }

  voir(id: number): void {
    console.log(id);
  }
}