import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Post, PostService } from '../../services/post';
import { CreatePostComponent } from '../post/create-post/create-post';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from "@angular/material/input";
import { CommentsListComponent } from "../comment/comments-list/comments-list";
import { CommentFormComponent } from "../comment/comment-form/comment-form";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule, // ⬅️ Module MatDivider ajouté
    DatePipe, // Utilisation du pipe de date
    CreatePostComponent,
    MatInputModule,
    CommentsListComponent,
    CommentFormComponent
],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  showCreatePost = false; // Pour contrôler l'affichage du formulaire

  // Utilisé pour savoir quel post a sa zone de commentaires ouverte
  public activeCommentPostId: number | null = null;

  private postService = inject(PostService);
  private cdr = inject(ChangeDetectorRef); // 🚨 Injection
// post: any;

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.postService.getPosts().subscribe({
      next: (postsArray) => {
        // Le tableau de posts se trouve dans la propriété 'data' de la réponse Laravel
        this.posts = postsArray
        this.isLoading = false;

        // 🚨 Appelez detectChanges() ici 🚨
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement des posts:", err);
        this.errorMessage = "Impossible de charger le fil d'actualité. Veuillez réessayer.";
        this.isLoading = false;

        // 🚨 Appelez detectChanges() ici 🚨
        this.cdr.detectChanges();
      }
    });
  }

  // Fonction pour déterminer l'icône à afficher
  getIcon(type: string): string {
    switch (type) {
      case 'video': return 'movie';
      case 'audio': return 'headset';
      case 'prayer': return 'book';
      default: return 'public';
    }
  }

  // Note: Ici, vous ajouteriez des méthodes pour ouvrir le formulaire de création de post
  openCreatePostModal(): void {
    console.log("Ouvrir le formulaire de création de post");
    // Redirection vers une route ou ouverture d'un MatDialog
  }

  // Méthode pour basculer la visibilité du formulaire (à l'appel du bouton 'Publier')
    toggleCreatePostForm(): void {
        this.showCreatePost = !this.showCreatePost;
    }

    // Méthode appelée lorsque le post est créé (pour rafraîchir la liste)
    onPostCreated(): void {
        this.showCreatePost = false; // Fermer le formulaire après succès
        this.loadPosts(); // Recharger le fil d'actualité
    }

    trackById(index: number, post: any): number {
  // Cette fonction s'assure qu'Angular peut obtenir un ID de manière sécurisée.
  // Elle résout les problèmes de mise à jour du DOM.
  return post.id;
}

// Méthode pour basculer la visibilité de la zone de commentaires
    toggleComments(postId: number): void {
        if (this.activeCommentPostId === postId) {
            this.activeCommentPostId = null; // Fermer si déjà ouvert
        } else {
            this.activeCommentPostId = postId; // Ouvrir ce post
            // Ici, vous lanceriez idéalement la requête pour charger les commentaires du post
        }
    }

  // Méthode pour simuler l'action de partage (Web Share API ou Copier le lien)
    sharePost(post: any): void {
    // 1. Définir l'URL du post (assurez-vous que cette route existe dans votre Angular)
    const postUrl = `${window.location.origin}/home?post=${post.id}`;
    const shareData = {
        title: post.title,
        text: 'Découvrez ce message de Cure D\'Âme 2025: ' + post.content.substring(0, 80) + '...',
        url: postUrl,
    };

    // 2. Appeler l'API Laravel (sans attendre la réponse pour ne pas bloquer l'utilisateur)
    this.postService.incrementShareCount(post.id).subscribe({
        next: () => console.log('Compteur de partage incrémenté.'),
        error: (err) => console.error('Erreur lors de l\'incrémentation du partage:', err)
    });

    // 3. Exécuter l'action de partage côté client
    if (navigator.share) {
        // API Web Share : Ouvre la boîte de dialogue native du système
        navigator.share(shareData)
        // .then(() => alert('Partage réussi!'))
        .catch((error) => {
            // Si l'utilisateur annule, ce n'est pas une erreur
            if (error.name !== 'AbortError') {
                console.error('Erreur de partage:', error);
            }
        });
    } else {
        // Solution de secours : Copier le lien
        navigator.clipboard.writeText(postUrl);
        alert('Lien du post copié dans le presse-papiers!');
    }
 }
}
