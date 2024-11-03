import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private router: Router
  ) {
    // Initialize with stored user data if available
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  async signInWithGoogle(): Promise<void> {
    try {
      // Mock Google sign-in
      const mockGoogleUser: User = {
        uid: 'google-' + Math.random().toString(36).substr(2, 9),
        email: 'mock.google.user@example.com',
        displayName: 'Mock Google User',
        photoURL: 'https://via.placeholder.com/150'
      };
      this.updateUserData(mockGoogleUser);
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    try {
      // Mock email/password sign-in
      if (email && password) {
        const mockEmailUser: User = {
          uid: 'email-' + Math.random().toString(36).substr(2, 9),
          email: email,
          displayName: email.split('@')[0]
        };
        this.updateUserData(mockEmailUser);
        await this.router.navigate(['/home']);
      } else {
        throw new Error('Email and password are required');
      }
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  }

  async signUp(email: string, password: string, displayName: string): Promise<void> {
    try {
      // Mock sign-up
      if (email && password && displayName) {
        const mockNewUser: User = {
          uid: 'new-' + Math.random().toString(36).substr(2, 9),
          email: email,
          displayName: displayName
        };
        this.updateUserData(mockNewUser);
        await this.router.navigate(['/home']);
      } else {
        throw new Error('Email, password, and display name are required');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      await this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  // Helper method to update user data
  private updateUserData(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
