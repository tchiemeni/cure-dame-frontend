import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
// import { AuthService } from '../services/auth.service';

// Le Auth Guard est une fonction (CanActivateFn)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // L'utilisateur est connecté, autoriser l'accès à la route
  } else {
    // L'utilisateur n'est pas connecté, le rediriger vers la page de connexion
    router.navigate(['/login']);
    return false;
  }
};
