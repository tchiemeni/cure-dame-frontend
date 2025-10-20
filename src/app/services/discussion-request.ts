import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// import { environment } from '../../environments/environment.development';

// Interface pour le format des données envoyées
export interface DiscussionRequestData {
  subject: string;
  message: string;
}

// Interface pour le format de la réponse (inclut le statut)
export interface DiscussionRequest {
  id: number;
  user_id: number;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiscussionRequestService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  /**
   * Soumet une nouvelle requête de discussion à l'Homme de Dieu.
   * ROUTE: POST /api/discussion-requests
   */
  submitRequest(data: DiscussionRequestData): Observable<any> {
    // L'Interceptor ajoute automatiquement le token Sanctum
    return this.http.post<any>(`${this.apiUrl}/discussion-requests`, data);
  }

  /**
   * Récupère les requêtes soumises par l'utilisateur connecté.
   * ROUTE: GET /api/discussion-requests/me
   */
  getUserRequests(): Observable<DiscussionRequest[]> {
    return this.http.get<DiscussionRequest[]>(`${this.apiUrl}/discussion-requests/me`);
  }

  takeActionOnRequest(requestId: number): Observable<any> {
    // 🚨 CORRECTION ANGULAR : AJOUTER 'admin/' AU CHEMIN 🚨
    const url = `${this.apiUrl}/admin/requests/${requestId}/take-action`;

    // Le corps est vide, car l'ID est dans l'URL et le statut est fixe ('in_progress')
    // Le second argument doit être null pour les requêtes POST sans corps, ou un objet vide {}
    return this.http.post<any>(url, {});
  }

  getAllRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/requests`);
    // Assurez-vous que cette route existe et est bien protégée côté Laravel!
}
}
