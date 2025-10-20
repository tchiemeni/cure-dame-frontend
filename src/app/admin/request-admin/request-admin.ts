import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit,ChangeDetectionStrategy,ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DiscussionRequestService } from '../../services/discussion-request';

@Component({
  selector: 'app-request-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // 🚨 Apply this
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    DatePipe
  ],
  templateUrl: './request-admin.html',
  styleUrls: ['./request-admin.scss']
})
export class RequestAdminComponent implements OnInit {
  requests: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;


  private requestService = inject(DiscussionRequestService);
  private cdr = inject(ChangeDetectorRef); // 🚨 INJECTEZ CECI 🚨

  ngOnInit(): void {
    this.loadAllRequests();
  }

  trackById(index: number, request: any): number {
    // 🚨 C'EST LA MÉTHODE MANQUANTE 🚨
    return request.id;
  }

  loadAllRequests(): void {
   this.isLoading = true;
    this.requestService.getAllRequests().subscribe({ // Assurez-vous que cette route existe
        next: (data) => {
            this.requests = data;
            this.isLoading = false; // 🚨 DÉSACTIVER LE SPINNER EN CAS DE SUCCÈS
            this.errorMessage = null;
            this.cdr.detectChanges();
        },
        error: (err) => {
            console.error('Erreur de chargement des requêtes:', err);
            this.errorMessage = 'Erreur lors du chargement des requêtes. Veuillez réessayer.';
            this.isLoading = false; // 🚨 DÉSACTIVER LE SPINNER EN CAS D'ERREUR

            this.cdr.detectChanges();
        }
    });
  }

  markAsInProgress(requestId: number): void {
    if (!confirm('Êtes-vous sûr de vouloir prendre en charge cette requête et notifier l\'utilisateur ?')) {
        return;
    }

    this.requestService.takeActionOnRequest(requestId).subscribe({
        next: (updatedRequest) => {
            // Mise à jour de la liste locale
            const index = this.requests.findIndex(r => r.id === requestId);
            if (index !== -1) {
                // Remplacer l'objet existant par la réponse mise à jour

                // 🚨 IMPORTANT POUR ONPUSH : Remplacer l'élément et cloner le tableau
                // Cloner le tableau force OnPush à détecter le changement
                const updatedRequests = [...this.requests];
                updatedRequests[index] = updatedRequest;
                this.requests = updatedRequests;
                alert('Statut mis à jour et courriel de notification envoyé.');
                this.cdr.detectChanges(); // 🚨 Rafraîchissement après l'action 🚨
            }
        },
        error: (err) => {
            console.error('Erreur lors de la prise en charge:', err);
            alert('Échec de la mise à jour du statut. (Peut-être le statut n\'était pas "pending")');
        }
    });
  }

  // Fonction utilitaire pour l'affichage (optionnel, selon votre besoin)
  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'En Attente';
      case 'in_progress': return 'En Cours';
      case 'resolved': return 'Résolue';
      default: return 'Inconnu';
    }
  }
}
