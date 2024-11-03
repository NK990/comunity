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
    path: 'prayer',
    loadComponent: () => import('./pages/prayer/prayer.page').then(m => m.PrayerPage)
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/events/events.page').then(m => m.EventsPage)
  },
  {
    path: 'quran',
    loadComponent: () => import('./pages/quran/quran.page').then(m => m.QuranPage)
  },
  {
    path: 'forum',
    loadComponent: () => import('./pages/forum/forum.page').then(m => m.ForumPage)
  },
  {
    path: 'donation',
    loadComponent: () => import('./pages/donation/donation.page').then(m => m.DonationPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
