import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common'; // Nécessaire pour *ngIf
import { AuthService } from '../../../services/auth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.errorMessage = "Veuillez entrer un email et un mot de passe valides.";
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Le backend Laravel a renvoyé le token
        this.authService.setToken(response.token);
        this.router.navigate(['/home']); // Redirection vers le fil d'actualité
      },
      error: (err) => {
        console.error('Erreur de connexion:', err);
        // Le code 401 Unauthorized vient de Laravel si les identifiants sont faux
        if (err.status === 401) {
          this.errorMessage = "Email ou mot de passe incorrect.";
        } else {
          this.errorMessage = "Une erreur est survenue lors de la connexion.";
        }
      }
    });
  }
}
