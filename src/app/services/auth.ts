import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
// import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';


 constructor() {
    // Cette logique DOIT être exécutée au démarrage du service
    const role = localStorage.getItem('user_role') as 'user' | 'admin' | 'homme_de_dieu' | null;

    // 💡 AJOUTEZ CE LOG DE DÉBOGAGE :
    console.log("AUTH SERVICE - Démarrage, Rôle récupéré du localStorage:", role);

    // 🚨 Met à jour le BehaviorSubject avec la valeur récupérée
    this.roleSubject.next(role);
}

  // 1. Inscription (Register)
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // 2. Connexion (Login)
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
       tap(response => {
            // 🚨 Correction : Utiliser l'opérateur de chaînage optionnel (?.)
            // et fournir une valeur par défaut ('user') si le rôle n'existe pas.
            const rawRole = response.user?.role;

            // Nettoyage : Si rawRole existe, on nettoie (trim et lowercase), sinon c'est 'user'.
            const userRole = rawRole ? rawRole.trim().toLowerCase() : 'user';

            // 🚨 LOG CRITIQUE 🚨
            console.log("LOG 1: Rôle stocké sécurisé:", userRole);

            this.setToken(response.token);

            // On stocke toujours une chaîne valide ('admin' ou 'user')
            localStorage.setItem('user_role', userRole);
            this.roleSubject.next(userRole);
        })
    );
}

  // 3. Déconnexion (Logout)
  logout(): Observable<any> {
    // Le token est envoyé via un Interceptor (voir ci-dessous)
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  // 4. Gestion du Token (LocalStorage)
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 🚨 1. NOUVEAU BehaviorSubject pour stocker le rôle 🚨
  private roleSubject = new BehaviorSubject<'user' | 'admin' | 'homme_de_dieu' | null>(null);

  // 🚨 2. Observable public (currentUserRole$) pour les composants et Guards 🚨
  public currentUserRole$: Observable<'user' | 'admin' | 'homme_de_dieu' | null> = this.roleSubject.asObservable();

  // Méthode utilitaire pour charger le rôle initial
  private loadInitialRole(): void {
    const role = localStorage.getItem('user_role') as 'user' | 'admin' | 'homme_de_dieu' | null;
    this.roleSubject.next(role);
  }

  // Méthode pour vérifier si l'utilisateur est admin (utilisé par le Guard)
  // Non nécessaire si on utilise l'Observable directement, mais utile pour d'autres vérifications.
  public isAdmin(): boolean {
    const role = this.roleSubject.value;
    return role === 'admin' || role === 'homme_de_dieu';
  }
}
