import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PostService } from '../../../services/post';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './comment-form.html',
  styleUrls: ['./comment-form.scss']
})
export class CommentFormComponent {
  @Input({ required: true }) postId!: number;
  @Output() commentSubmitted = new EventEmitter<any>(); // Émet le nouveau commentaire

  commentForm: FormGroup;
  isLoading = false;

  private fb = inject(FormBuilder);
  private postService = inject(PostService);

  constructor() {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  onSubmit(): void {
    if (this.commentForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const content = this.commentForm.get('content')?.value;

    this.postService.addComment(this.postId, content).subscribe({
      next: (newComment) => {
        this.commentSubmitted.emit(newComment);
        this.commentForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de soumission du commentaire:', err);
        alert('Erreur: Impossible d\'ajouter le commentaire.');
        this.isLoading = false;
      }
    });
  }
}
