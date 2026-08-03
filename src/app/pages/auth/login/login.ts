import { Component, ChangeDetectorRef, NgZone } from '@angular/core'; // 👈 1. Imports
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage = '';
  loading = false;

  // 👈 2. Injecter ChangeDetectorRef (cdr) + NgZone (zone)
  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (response: any) => {
        this.zone.run(() => {
          this.loading = false;
          this.authService.saveSessionFromResponse(response);
          this.router.navigate(['/tableau-de-bord']);
          this.cdr.detectChanges(); // ⚡ Force update DOM
        });
      },
      error: (err) => {
       
        this.zone.run(() => {
          this.loading = false;
          this.errorMessage = err.error?.message || "Email ou mot de passe incorrect.";
          this.cdr.detectChanges();
        });
      }
    });
  }
}