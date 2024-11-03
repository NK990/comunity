import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in months
  features: string[];
}

export interface UserSubscription {
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly STORAGE_KEY = 'userSubscription';
  private subscriptionSubject: BehaviorSubject<UserSubscription | null>;
  public subscription$: Observable<UserSubscription | null>;

  public readonly plans: SubscriptionPlan[] = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 9.99,
      duration: 1,
      features: [
        'Access to premium Islamic content',
        'Ad-free experience',
        'Exclusive daily duas',
        'Community forum access',
        'Prayer time notifications'
      ]
    },
    {
      id: '6month',
      name: '6 Month Plan',
      price: 49.99,
      duration: 6,
      features: [
        'All Monthly Plan features',
        'Downloadable Islamic resources',
        'Priority community support',
        'Monthly virtual events',
        'Personalized prayer tracking'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: 89.99,
      duration: 12,
      features: [
        'All 6 Month Plan features',
        'One-on-one spiritual guidance',
        'Exclusive webinars',
        'Early access to new features',
        'Family account sharing (up to 3 members)'
      ]
    }
  ];

  constructor(private authService: AuthService) {
    const storedSubscription = localStorage.getItem(this.STORAGE_KEY);
    this.subscriptionSubject = new BehaviorSubject<UserSubscription | null>(
      storedSubscription ? JSON.parse(storedSubscription) : null
    );
    this.subscription$ = this.subscriptionSubject.asObservable();
  }

  getPlan(planId: string): SubscriptionPlan | undefined {
    return this.plans.find(plan => plan.id === planId);
  }

  async subscribeToPlan(planId: string): Promise<void> {
    if (!this.authService.currentUserValue) {
      throw new Error('User must be authenticated to subscribe');
    }

    const plan = this.getPlan(planId);
    if (!plan) {
      throw new Error('Invalid plan selected');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);

    const subscription: UserSubscription = {
      planId,
      startDate,
      endDate,
      status: 'active'
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(subscription));
    this.subscriptionSubject.next(subscription);
  }

  cancelSubscription(): void {
    const currentSubscription = this.subscriptionSubject.value;
    if (currentSubscription) {
      currentSubscription.status = 'cancelled';
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentSubscription));
      this.subscriptionSubject.next(currentSubscription);
    }
  }

  getCurrentSubscription(): UserSubscription | null {
    return this.subscriptionSubject.value;
  }

  isSubscribed(): boolean {
    const subscription = this.getCurrentSubscription();
    return subscription !== null &&
           subscription.status === 'active' &&
           new Date(subscription.endDate) > new Date();
  }

  hasAccess(): boolean {
    return this.authService.currentUserValue !== null && this.isSubscribed();
  }
}
