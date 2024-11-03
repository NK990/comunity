import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onGoogleSignIn() {
    try {
      await this.authService.signInWithGoogle();
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  }

  async onEmailSignIn() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.signInWithEmail(email, password);
        await this.router.navigate(['/home']);
      } catch (error) {
        console.error('Email sign-in error:', error);
      }
    }
  }

  goToSignup() {
    this.router.navigate(['/auth/signup']);
  }
}
