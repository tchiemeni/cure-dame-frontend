// src/app/models/user.model.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'homme_de_dieu'; // Assurez-vous d'avoir ce champ 'role'
}

// Optionnel: Créer une classe pour y ajouter la logique de permission
export class UserModel {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  isAdmin(): boolean {
    // 🚨 Logique de vérification 🚨
    return this.user.role === 'admin' || this.user.role === 'homme_de_dieu';
  }
}
