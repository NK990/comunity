import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with no user logged in', () => {
    expect(service.currentUserValue).toBeNull();
  });

  it('should sign in with Google', async () => {
    const result = await service.signInWithGoogle();
    expect(result).toBeTruthy();
    expect(service.currentUserValue).toBeTruthy();
    expect(service.currentUserValue?.email).toBeTruthy();
  });

  it('should sign in with email and password', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    const result = await service.signInWithEmail(email, password);
    expect(result).toBeTruthy();
    expect(service.currentUserValue).toBeTruthy();
    expect(service.currentUserValue?.email).toBe(email);
  });

  it('should sign up with email and password', async () => {
    const email = 'newuser@example.com';
    const password = 'password123';

    const result = await service.signUp(email, password);
    expect(result).toBeTruthy();
    expect(service.currentUserValue).toBeTruthy();
    expect(service.currentUserValue?.email).toBe(email);
  });

  it('should sign out successfully', async () => {
    // First sign in
    await service.signInWithEmail('test@example.com', 'password123');
    expect(service.currentUserValue).toBeTruthy();

    // Then sign out
    await service.signOut();
    expect(service.currentUserValue).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should persist user authentication state', () => {
    const testUser = { email: 'test@example.com' };

    // Simulate user login
    service['currentUserSubject'].next(testUser);

    // Check localStorage
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    expect(storedUser).toBeTruthy();
    expect(storedUser.email).toBe(testUser.email);
  });

  it('should load persisted user on initialization', () => {
    const testUser = { email: 'test@example.com' };

    // Store user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(testUser));

    // Create new instance of service
    const newService = TestBed.inject(AuthService);

    // Check if user was loaded
    expect(newService.currentUserValue).toBeTruthy();
    expect(newService.currentUserValue?.email).toBe(testUser.email);
  });

  it('should handle invalid login credentials', async () => {
    const email = 'invalid@example.com';
    const password = 'wrongpassword';

    await expectAsync(service.signInWithEmail(email, password))
      .toBeRejectedWithError('Invalid email or password');
  });

  it('should prevent duplicate email registration', async () => {
    const email = 'existing@example.com';
    const password = 'password123';

    // First registration should succeed
    await service.signUp(email, password);

    // Second registration with same email should fail
    await expectAsync(service.signUp(email, password))
      .toBeRejectedWithError('Email already exists');
  });
});
