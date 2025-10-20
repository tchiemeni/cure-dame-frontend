import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { DiscussionRequest, DiscussionRequestData, DiscussionRequestService } from '../../../services/discussion-request';

@Component({
  selector: 'app-discussion-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule // Pour afficher les détails des requêtes
  ],
  templateUrl: './discussion-request.html',
  styleUrls: ['./discussion-request.scss']
})
export class DiscussionRequestComponent implements OnInit {
  requestForm: FormGroup;
  submittedRequests: DiscussionRequest[] = [];
  formMessage: { type: 'success' | 'error', text: string } | null = null;

  private fb = inject(FormBuilder);
  private discussionService = inject(DiscussionRequestService);
  private cdr = inject(ChangeDetectorRef); // 🚨 Injection

  constructor() {
    this.requestForm = this.fb.group({
      subject: ['', [Validators.required, Validators.maxLength(255)]],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUserRequests();
  }

  loadUserRequests(): void {
    this.discussionService.getUserRequests().subscribe({
      next: (requests) => {
        this.submittedRequests = requests;

        // 🚨 Appelez detectChanges() ici 🚨
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur de chargement des requêtes:", err);
        // Afficher une erreur si nécessaire

        // 🚨 Appelez detectChanges() ici 🚨
        this.cdr.detectChanges();
      }
    });
  }

  // 🔔 CETTE MÉTHODE DOIT ÊTRE À L'INTÉRIEUR DE LA CLASSE !
  getStatusText(status: string): string {
      switch (status) {
          case 'pending': return 'En attente';
          case 'in_progress': return 'En cours';
          case 'resolved': return 'Résolue';
          default: return 'Inconnu';
      }
  }

  onSubmit(): void {
    this.formMessage = null;

    if (this.requestForm.invalid) {
      this.formMessage = { type: 'error', text: "Veuillez remplir correctement tous les champs." };
      return;
    }

    const data: DiscussionRequestData = this.requestForm.value;

    this.discussionService.submitRequest(data).subscribe({
      next: (response) => {
        this.formMessage = { type: 'success', text: response.message || "Votre requête a été envoyée avec succès !" };
        this.requestForm.reset();
        // Recharge la liste pour afficher la nouvelle requête
        this.loadUserRequests();
      },
      error: (err) => {
        console.error('Erreur de soumission:', err);
        this.formMessage = { type: 'error', text: "Échec de l'envoi de la requête. Veuillez réessayer." };
      }
    });
  }
}
