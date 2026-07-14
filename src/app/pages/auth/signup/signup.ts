import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth'; 

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  user = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: '' 
  };

  passwordContainsName: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Vérification stricte du mot de passe
  checkPasswordSecurity() {
    if (!this.user.password) {
      this.passwordContainsName = false;
      return;
    }

    const pwd = this.user.password.toLowerCase();
    const nom = this.user.nom.toLowerCase();
    const prenom = this.user.prenom.toLowerCase();
    const email = this.user.email.toLowerCase();

    let entreprise = '';
    if (email && email.includes('@')) {
      const partieApresArobase = email.split('@')[1]; 
      entreprise = partieApresArobase.split('.')[0]; 
    }

    // Validation finale
    if (
      (nom && pwd.includes(nom)) || 
      (prenom && pwd.includes(prenom)) || 
      (entreprise && entreprise.length > 2 && pwd.includes(entreprise))
    ) {
      this.passwordContainsName = true;
    } else {
      this.passwordContainsName = false;
    }
  }

  onSubmit(form: NgForm) {
    this.checkPasswordSecurity();

    if (form.invalid || this.passwordContainsName) {
      alert("Veuillez remplir correctement tous les champs.");
      return; 
    }

    console.log('Données prêtes à l\'envoi :', this.user);
    
    this.authService.signUp(this.user).subscribe({
      next: (response: any) => {
        alert('Compte créé avec succès !');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error(err);
        // Si le backend renvoie une erreur (par exemple parce que l'email existe déjà dans la base)
        alert('Erreur lors de l\'inscription : ' + (err.error || 'Erreur serveur'));
      }
    });
  }
}