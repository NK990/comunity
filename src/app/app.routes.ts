import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.page').then(m => m.LoginPage)
      },
      {
        path: 'signup',
        loadComponent: () => import('./pages/auth/signup/signup.page').then(m => m.SignupPage)
      }
    ]
  },
  {
    path: 'subscription',
    loadComponent: () => import('./pages/subscription/subscription.page').then(m => m.SubscriptionPage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
