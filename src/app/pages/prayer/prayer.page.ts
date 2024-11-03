import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrayerService, PrayerTime } from '../../services/prayer/prayer.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prayer',
  templateUrl: './prayer.page.html',
  styleUrls: ['./prayer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule]
})
export class PrayerPage implements OnInit {
  prayerTimes: PrayerTime | null = null;
  qiblaDirection: number = 0;
  selectedCity: string = 'London';
  selectedCountry: string = 'UK';
  prayers: { name: string; time: string }[] = [];

  cities = [
    { city: 'London', country: 'UK' },
    { city: 'Dubai', country: 'UAE' },
    { city: 'New York', country: 'USA' },
    { city: 'Istanbul', country: 'Turkey' },
    { city: 'Mecca', country: 'Saudi Arabia' }
  ];

  constructor(private prayerService: PrayerService) {}

  ngOnInit() {
    this.loadPrayerTimes();
    this.qiblaDirection = this.prayerService.getQiblaDirection();
  }

  loadPrayerTimes() {
    this.prayerService.updateLocation(this.selectedCity, this.selectedCountry);
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
      }
    );
  }

  onLocationChange() {
    this.loadPrayerTimes();
  }

  getQiblaStyle() {
    return {
      transform: `rotate(${this.qiblaDirection}deg)`
    };
  }
}
