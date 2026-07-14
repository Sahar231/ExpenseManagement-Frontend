import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FraisService } from '../../../core/services/frais'; // Adaptez le chemin

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation.html'
})
export class ValidationComponent implements OnInit {
  fraisAValider: any[] = [];

  constructor(private fraisService: FraisService) {}

  ngOnInit() {
    this.chargerFrais();
  }

  chargerFrais() {
    this.fraisService.getFraisAValider().subscribe(data => {
      this.fraisAValider = data;
    });
  }

  approuver(id: number) {
  this.fraisService.approuverFrais(id)
    .subscribe(() => {
      this.chargerFrais();
    });
}

rejeter(id: number) {

  const commentaire = prompt('Entrez le motif du rejet');

  if (!commentaire) {
    return;
  }

  this.fraisService.rejeterFrais(id, commentaire)
    .subscribe(() => {
      this.chargerFrais();
    });
}
voir(id: number) {
  this.fraisService.getDetailsFrais(id).subscribe({
    next: (data) => {
      console.log(data);
    },
    error: (err) => {
      console.error(err);
    }
  });
}
}