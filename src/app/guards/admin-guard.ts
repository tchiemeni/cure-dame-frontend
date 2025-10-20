import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Supposons que votre AuthService expose un Observable de l'utilisateur ou de son rôle.
  return authService.currentUserRole$.pipe(
    take(1), // Prend la dernière valeur et complète
    map(role => {

      // Si le rôle est null (pas connecté), on redirige.
      if (!role) {
         return router.createUrlTree(['/login']);
      }
      // 🚨 Logique de vérification du rôle 🚨
      const isAdmin = role === 'admin' || role === 'homme_de_dieu';

      if (isAdmin) {
        return true; // Accès autorisé
      } else {
        // Redirection vers la page d'accueil si l'utilisateur n'est pas admin
        alert('Accès refusé. Vous devez être administrateur.');
        return router.createUrlTree(['/home']);
      }
    })
  );
};
