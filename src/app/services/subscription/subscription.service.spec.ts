import { TestBed } from '@angular/core/testing';
import { SubscriptionService } from './subscription.service';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['currentUserValue']);

    TestBed.configureTestingModule({
      providers: [
        SubscriptionService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(SubscriptionService);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have three subscription plans', () => {
    expect(service.plans.length).toBe(3);
    expect(service.plans[0].id).toBe('monthly');
    expect(service.plans[1].id).toBe('6month');
    expect(service.plans[2].id).toBe('yearly');
  });

  it('should have correct pricing for plans', () => {
    expect(service.plans[0].price).toBe(9.99);  // Monthly
    expect(service.plans[1].price).toBe(49.99); // 6-month
    expect(service.plans[2].price).toBe(89.99); // Yearly
  });

  it('should not allow subscription without authentication', async () => {
    authService.currentUserValue = null;

    await expectAsync(service.subscribeToPlan('monthly'))
      .toBeRejectedWithError('User must be authenticated to subscribe');
  });

  it('should allow subscription with authentication', async () => {
    authService.currentUserValue = { email: 'test@example.com' };

    await expectAsync(service.subscribeToPlan('monthly')).toBeResolved();
  });

  it('should correctly check subscription status', () => {
    // Test when user has no subscription
    expect(service.isSubscribed()).toBeFalse();

    // Simulate subscribing
    service['userSubscription'].next({
      planId: 'monthly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    expect(service.isSubscribed()).toBeTrue();
  });

  it('should handle subscription cancellation', () => {
    // Subscribe first
    service['userSubscription'].next({
      planId: 'monthly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    // Cancel subscription
    service.cancelSubscription();

    // Check if subscription is cancelled
    const currentSub = service.getCurrentSubscription();
    expect(currentSub?.status).toBe('cancelled');
  });

  it('should verify subscription features', () => {
    // Monthly plan features
    expect(service.plans[0].features).toContain('Access to premium Islamic content');
    expect(service.plans[0].features).toContain('Ad-free experience');

    // 6-month plan features
    expect(service.plans[1].features).toContain('All Monthly Plan features');
    expect(service.plans[1].features).toContain('Downloadable Islamic resources');

    // Yearly plan features
    expect(service.plans[2].features).toContain('All 6 Month Plan features');
    expect(service.plans[2].features).toContain('Family account sharing (up to 3 members)');
  });
});
