import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class SignupPage {
  signupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  async onGoogleSignUp() {
    try {
      // Will implement Google sign-up logic here once Firebase is configured
      console.log('Google sign-up clicked');
    } catch (error) {
      console.error('Google sign-up error:', error);
    }
  }

  async onEmailSignUp() {
    if (this.signupForm.valid) {
      try {
        // Will implement email sign-up logic here once Firebase is configured
        console.log('Email sign-up:', this.signupForm.value);
      } catch (error) {
        console.error('Email sign-up error:', error);
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
