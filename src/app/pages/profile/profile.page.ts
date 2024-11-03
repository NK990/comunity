import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  ProfileService,
  UserProfile,
  PrivacySettings,
  NotificationPreferences
} from '../../services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule]
})
export class ProfilePage implements OnInit {
  profile: UserProfile = {
    id: '',
    displayName: '',
    email: '',
    location: '',
    interests: [],
    bio: ''
  };
  privacySettings: PrivacySettings = {
    profileVisibility: 'public',
    showLocation: true,
    showAge: false,
    showInterests: true,
    allowMessages: true
  };
  notificationPreferences: NotificationPreferences = {
    prayers: true,
    events: true,
    discussions: true,
    messages: true,
    donations: false,
    dailyHadith: true,
    sound: true,
    vibration: true
  };
  selectedSegment: 'profile' | 'privacy' | 'notifications' = 'profile';
  isEditing = false;
  availableInterests = [
    'Islamic Studies',
    'Quran Recitation',
    'Community Events',
    'Charity Work',
    'Islamic History',
    'Family & Relationships',
    'Education',
    'Halal Business'
  ];

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.loadProfile();
    this.loadPrivacySettings();
    this.loadNotificationPreferences();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe(profile => {
      this.profile = profile;
    });
  }

  loadPrivacySettings() {
    this.profileService.getPrivacySettings().subscribe(settings => {
      this.privacySettings = settings;
    });
  }

  loadNotificationPreferences() {
    this.profileService.getNotificationPreferences().subscribe(preferences => {
      this.notificationPreferences = preferences;
    });
  }

  async saveProfile() {
    await this.profileService.updateProfile(this.profile);
    this.isEditing = false;
  }

  async savePrivacySettings() {
    await this.profileService.updatePrivacySettings(this.privacySettings);
  }

  async saveNotificationPreferences() {
    await this.profileService.updateNotificationPreferences(this.notificationPreferences);
  }

  async uploadAvatar(event: any) {
    const file = event.target.files[0];
    if (file) {
      const avatarUrl = await this.profileService.uploadAvatar(file);
      this.profile = {
        ...this.profile,
        avatar: avatarUrl
      };
      await this.saveProfile();
    }
  }

  toggleInterest(interest: string) {
    const index = this.profile.interests.indexOf(interest);
    if (index === -1) {
      this.profile.interests.push(interest);
    } else {
      this.profile.interests.splice(index, 1);
    }
  }

  isInterestSelected(interest: string): boolean {
    return this.profile.interests.includes(interest);
  }

  async saveAllSettings() {
    const success = await this.profileService.saveAllSettings(
      this.profile,
      this.privacySettings,
      this.notificationPreferences
    );
    if (success) {
      this.isEditing = false;
    }
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }
}
