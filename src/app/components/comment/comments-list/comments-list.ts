import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostService } from '../../../services/post';

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe
  ],
  templateUrl: './comments-list.html',
  styleUrls: ['./comments-list.scss']
})
export class CommentsListComponent implements OnInit {
  @Input({ required: true }) postId!: number;

  comments: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  private postService = inject(PostService);

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.postService.getComments(this.postId).subscribe({
      next: (data) => {
        this.comments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de chargement des commentaires:', err);
        this.errorMessage = 'Erreur lors du chargement des commentaires.';
        this.isLoading = false;
      }
    });
  }
  /**
     * Fonction trackBy pour l'optimisation des performances dans ngFor.
     */
    trackById(index: number, comment: any): number {
        return comment.id;
    }
  // Méthode appelée par le CommentFormComponent pour ajouter un nouveau commentaire
  addCommentToList(comment: any): void {
    // Ajoute le nouveau commentaire en haut de la liste
    this.comments.unshift(comment);
  }
}
