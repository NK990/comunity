import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  location: string;
  age?: number;
  interests: string[];
  avatar?: string;
  bio?: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showLocation: boolean;
  showAge: boolean;
  showInterests: boolean;
  allowMessages: boolean;
}

export interface NotificationPreferences {
  prayers: boolean;
  events: boolean;
  discussions: boolean;
  messages: boolean;
  donations: boolean;
  dailyHadith: boolean;
  sound: boolean;
  vibration: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profile = new BehaviorSubject<UserProfile>({
    id: '1',
    displayName: 'User',
    email: 'user@example.com',
    location: 'New York',
    interests: ['Islamic Studies', 'Community Events'],
    bio: 'Assalamu alaikum! I am here to learn and connect with the community.'
  });

  private privacySettings = new BehaviorSubject<PrivacySettings>({
    profileVisibility: 'public',
    showLocation: true,
    showAge: false,
    showInterests: true,
    allowMessages: true
  });

  private notificationPreferences = new BehaviorSubject<NotificationPreferences>({
    prayers: true,
    events: true,
    discussions: true,
    messages: true,
    donations: false,
    dailyHadith: true,
    sound: true,
    vibration: true
  });

  constructor() {}

  getProfile(): Observable<UserProfile> {
    return this.profile.asObservable();
  }

  updateProfile(profile: Partial<UserProfile>): void {
    this.profile.next({
      ...this.profile.value,
      ...profile
    });
  }

  getPrivacySettings(): Observable<PrivacySettings> {
    return this.privacySettings.asObservable();
  }

  updatePrivacySettings(settings: Partial<PrivacySettings>): void {
    this.privacySettings.next({
      ...this.privacySettings.value,
      ...settings
    });
  }

  getNotificationPreferences(): Observable<NotificationPreferences> {
    return this.notificationPreferences.asObservable();
  }

  updateNotificationPreferences(preferences: Partial<NotificationPreferences>): void {
    this.notificationPreferences.next({
      ...this.notificationPreferences.value,
      ...preferences
    });
  }

  async uploadAvatar(file: File): Promise<string> {
    // In a real app, this would upload to a storage service
    // For now, we'll simulate a successful upload
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('https://example.com/avatar.jpg');
      }, 1000);
    });
  }

  async saveAllSettings(
    profile: Partial<UserProfile>,
    privacy: Partial<PrivacySettings>,
    notifications: Partial<NotificationPreferences>
  ): Promise<boolean> {
    try {
      this.updateProfile(profile);
      this.updatePrivacySettings(privacy);
      this.updateNotificationPreferences(notifications);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }
}
