import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

// import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth';
// import { RouterOutlet } from "../../../node_modules/@angular/router/router_module.d";

@Component({
  selector: 'app-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,   // Permet l'utilisation du routerLink dans le template
    CommonModule,
]
})
export class NavigationComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);

  public authService = inject(AuthService);
  private router = inject(Router);



  constructor() {}
  // Variable booléenne synchrone qui sera utilisée dans le template
  isUserAdmin: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    ngOnInit(): void { // 🚨 AJOUTER ngOnInit 🚨
    // S'abonner à l'Observable et mettre à jour la variable synchrone
    this.isAdmin$.subscribe(isAdmin => {
      this.isUserAdmin = isAdmin;
      console.log('LOG N: isUserAdmin mis à jour à:', this.isUserAdmin); // Vérifiez ce log !
    });
  }

  // 🚨 NOUVELLE PROPRIÉTÉ : Observable qui vérifie si l'utilisateur est admin 🚨
  isAdmin$: Observable<boolean> = this.authService.currentUserRole$.pipe(
    map(role => {
        if (!role) return false;
        const lowerRole = role.toLowerCase();
        return lowerRole === 'admin' || lowerRole === 'homme_de_dieu';
    }),
    shareReplay(1)
);

  logout() {
  this.authService.logout().subscribe({
    next: () => {
      // Retirer le token localement
      this.authService.removeToken();
      // Rediriger vers la page de connexion
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Erreur lors de la déconnexion', err);
      // Même en cas d'erreur API, on déconnecte localement pour ne pas rester bloqué
      this.authService.removeToken();
      this.router.navigate(['/login']);
    }
  });


}
}
