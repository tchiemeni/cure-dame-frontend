import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { PostService } from '../../../services/post';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  templateUrl: './create-post.html',
  styleUrls: ['./create-post.scss']
})
export class CreatePostComponent {
  // Événement émis après la création réussie d'un post (pour rafraîchir le fil d'actualité)
  @Output() postCreated = new EventEmitter<void>();

  postForm: FormGroup;
  selectedFile: File | null = null;
  isLoading = false;
  uploadError: string | null = null;

  // Définition des types de posts
  postTypes = [
    { value: 'video', label: 'Vidéo 🎥' },
    { value: 'audio', label: 'Audio 🎧' },
    { value: 'prayer', label: 'Prière / Message 📝' }
  ];

  private fb = inject(FormBuilder);
  private postService = inject(PostService);

  constructor() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: [''],
      type: ['prayer', Validators.required], // 'prayer' par défaut
      media: [null] // Champ invisible pour la validation du fichier
    });

    // Écoute les changements du champ 'type' pour ajuster les validateurs si besoin
    this.postForm.get('type')?.valueChanges.subscribe(type => {
      this.updateValidators(type);
    });
  }

  // Ajuste la validation du champ 'content' ou 'media' en fonction du type
  updateValidators(type: string): void {
    const contentControl = this.postForm.get('content');
    const mediaControl = this.postForm.get('media');

    if (type === 'prayer') {
      // Pour les prières/messages, le contenu textuel est obligatoire
      contentControl?.setValidators(Validators.required);
      mediaControl?.clearValidators(); // Pas de fichier requis
    } else {
      // Pour vidéo/audio, le fichier est techniquement nécessaire (bien que non validé côté Angular ici)
      // On peut rendre le contenu textuel optionnel si le titre est suffisant
      contentControl?.clearValidators();
    }
    contentControl?.updateValueAndValidity();
    mediaControl?.updateValueAndValidity();
  }

  // Gère la sélection du fichier par l'utilisateur
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Mettre à jour le contrôle 'media' pour le suivi du formulaire
      this.postForm.get('media')?.setValue(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.postForm.get('media')?.setValue(null);
    }
  }

  onSubmit(): void {
    if (this.postForm.invalid) return;

    this.isLoading = true;
    this.uploadError = null;

    // Utilisation de FormData pour envoyer le fichier avec les autres champs
    const formData = new FormData();
    formData.append('title', this.postForm.get('title')?.value);
    formData.append('content', this.postForm.get('content')?.value || '');
    formData.append('type', this.postForm.get('type')?.value);

    // Ajout du fichier s'il est sélectionné
    if (this.selectedFile) {
      formData.append('media_file', this.selectedFile, this.selectedFile.name);
    }

    this.postService.createPost(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.uploadError = null;
        alert('Contenu publié avec succès !');
        this.postForm.reset({ type: 'prayer' }); // Réinitialiser le formulaire
        this.selectedFile = null;
        this.postCreated.emit(); // Rafraîchir le fil d'actualité
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur de publication:', err);
        this.uploadError = "Échec de la publication. Vérifiez la taille du fichier ou le type de média.";
        // Afficher des erreurs spécifiques si l'API Laravel les fournit (ex: validation)
      }
    });
  }
}
