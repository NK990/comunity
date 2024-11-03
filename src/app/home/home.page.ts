import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../services/auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PrayerService, PrayerTime, IslamicDate } from '../services/prayer/prayer.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class HomePage implements OnInit {
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;
  islamicDate: IslamicDate | null = null;
  prayerTimes: PrayerTime | null = null;
  nextPrayer: { name: string; time: string } | null = null;

  prayers: { name: string; time: string }[] = [];

  quickLinks = [
    { icon: 'time', title: 'Prayer Times', route: '/prayer' },
    { icon: 'calendar', title: 'Community Events', route: '/events' },
    { icon: 'book', title: 'Quran & Hadith', route: '/quran' },
    { icon: 'people', title: 'Community Forum', route: '/forum' },
    { icon: 'cash', title: 'Donations & Zakat', route: '/donation' },
    { icon: 'person', title: 'Profile', route: '/profile' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private prayerService: PrayerService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAuthenticated$ = this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  ngOnInit() {
    // Subscribe to auth state changes is handled by async pipe in template
    // Get Islamic date
    this.prayerService.getIslamicDate().subscribe(
      date => this.islamicDate = date
    );

    // Get prayer times
    this.prayerService.getPrayerTimes().subscribe(
      times => {
        this.prayerTimes = times;
        this.prayers = [
          { name: 'Fajr', time: times.fajr },
          { name: 'Sunrise', time: times.sunrise },
          { name: 'Dhuhr', time: times.dhuhr },
          { name: 'Asr', time: times.asr },
          { name: 'Maghrib', time: times.maghrib },
          { name: 'Isha', time: times.isha }
        ];
        this.nextPrayer = this.prayerService.getNextPrayer(times);
      }
    );
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
