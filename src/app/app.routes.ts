import { Routes } from '@angular/router';

// // Composants de la zone protégée :
import { HomeComponent } from './components/home/home'; // Fil d'actualité
// 🔔 Ajout du composant pour la requête de discussion (à créer)
import { DiscussionRequestComponent } from './components/discussion/discussion-request/discussion-request';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { NavigationComponent } from './navigation/navigation.component';
import { authGuard } from './guards/auth-guard';
import { RequestAdminComponent } from './admin/request-admin/request-admin';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  // 1. Routes publiques (accessibles sans être connecté)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },


  //2. Route principale avec Navigation et zones protégées
  {
    path: '',
    component: NavigationComponent,
    canActivate: [authGuard], // Le guard protège toutes les routes enfants
    children: [
      { path: 'home', component: HomeComponent }, // Fil d'actualité

      // 🔔 AJOUT DE LA ROUTE POUR LE FORMULAIRE DE DISCUSSION/REQUÊTE
      { path: 'request', component: DiscussionRequestComponent },

       // 🚨 ROUTE ADMINISTRATEUR PROTÉGÉE 🚨
      {
        path: 'admin/requests',
        component: RequestAdminComponent,
        canActivate: [adminGuard] // 👈 Le Guard applique la vérification de permission ici
      },

      // Redirection par défaut vers 'home'
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  },

  // 3. Route de rattrapage (Wildcard)
  // Rediriger vers '/home' par défaut si la route n'existe pas
  { path: '**', redirectTo: 'home' }
];
