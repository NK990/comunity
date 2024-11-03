import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubscriptionService, SubscriptionPlan } from '../../services/subscription/subscription.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SubscriptionPage implements OnInit {
  plans: SubscriptionPlan[] = [];
  currentSubscription: any = null;

  constructor(
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.plans = this.subscriptionService.plans;
    this.currentSubscription = this.subscriptionService.getCurrentSubscription();
  }

  async subscribeToPlan(planId: string) {
    try {
      if (!this.authService.currentUserValue) {
        await this.router.navigate(['/auth/login']);
        return;
      }

      await this.subscriptionService.subscribeToPlan(planId);
      // Show success message or redirect to dashboard
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error('Subscription error:', error);
      // Handle error (show toast message, etc.)
    }
  }

  async cancelSubscription() {
    try {
      this.subscriptionService.cancelSubscription();
      this.currentSubscription = null;
      // Show success message
    } catch (error) {
      console.error('Cancellation error:', error);
      // Handle error
    }
  }

  getFormattedPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}
