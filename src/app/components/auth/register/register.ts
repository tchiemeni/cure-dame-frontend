import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterLink ,// Pour le lien vers la connexion
    CommonModule
],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      // Laravel exige 'password_confirmation' pour la règle 'confirmed'
      password_confirmation: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire.";
      return;
    }

    // Vérification manuelle de la confirmation du mot de passe
    if (this.registerForm.value.password !== this.registerForm.value.password_confirmation) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        // Stockage du token et redirection
        this.authService.setToken(response.token);
        this.router.navigate(['/home']); // Rediriger vers la page d'accueil après l'inscription
      },
      error: (err) => {
        console.error('Erreur d\'inscription:', err);
        // Afficher les erreurs spécifiques de Laravel (ex: email déjà pris)
        if (err.status === 422 && err.error.errors) {
            this.errorMessage = Object.values(err.error.errors).flat().join(' ');
        } else {
            this.errorMessage = "Échec de l'inscription. Veuillez réessayer.";
        }
      }
    });
  }
}
