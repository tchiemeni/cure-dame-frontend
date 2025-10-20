import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// import { environment } from '../../environments/environment.development';

// 🔔 Interface simple pour les posts (à étendre si besoin)
export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string | null;
  type: 'video' | 'audio' | 'prayer';
  media_url: string | null;
  created_at: string;
  user: { id: number, name: string };
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  /**
   * Récupère le fil d'actualité (tous les posts).
   * Côté Laravel, cette route est publique (index) mais dans notre cas, elle est protégée par authGuard.
   * La pagination est gérée par Laravel.
   */
  getPosts(): Observable<any[]> {
    // Le `PostController` de Laravel renvoie un objet paginé (data, total, per_page, etc.)
   return this.http.get<any>(`${this.apiUrl}/posts`).pipe(
        map(response => {
            // Si Laravel retourne une pagination, les posts sont dans 'data'
            if (response && response.data) {
                return response.data;
            }
            // Sinon (si c'est juste un tableau direct)
            return response;
        })
    );
  }

  /**
   * Crée un nouveau post (vidéo, audio ou prière).
   * Note : Utilisez FormData pour envoyer des fichiers et d'autres données.
   */
  createPost(formData: FormData): Observable<Post> {
    // L'Interceptor ajoute automatiquement le token.
    return this.http.post<Post>(`${this.apiUrl}/posts`, formData);
  }

  /**
     * Récupère tous les commentaires pour un post spécifique.
     */
    getComments(postId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/posts/${postId}/comments`);
    }

    /**
     * Soumet un nouveau commentaire.
     */
    addComment(postId: number, content: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/posts/${postId}/comments`, { content });
    }

    /**
     * Incrémente le compteur de partage côté serveur.
     */
    incrementShareCount(postId: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/posts/${postId}/share`, {});
    }

  // Autres méthodes CRUD (show, update, delete) peuvent être ajoutées ici.
}
