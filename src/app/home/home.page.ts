import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../services/auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomePage implements OnInit {
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAuthenticated$ = this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  ngOnInit() {
    // Subscribe to auth state changes is handled by async pipe in template
  }

  async navigateToLogin() {
    await this.router.navigate(['/auth/login']);
  }

  async navigateToSignup() {
    await this.router.navigate(['/auth/signup']);
  }

  async signOut() {
    await this.authService.signOut();
  }
}
