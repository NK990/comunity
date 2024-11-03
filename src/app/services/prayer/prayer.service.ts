import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PrayerTime {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}

export interface IslamicDate {
  hijri: string;
  gregorian: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrayerService {
  private readonly PRAYER_API_URL = 'http://api.aladhan.com/v1/timingsByCity';
  private readonly DATE_API_URL = 'http://api.aladhan.com/v1/gToH';
  private currentLocation = new BehaviorSubject<{ city: string; country: string }>({
    city: 'London',
    country: 'UK'
  });

  constructor(private http: HttpClient) {}

  getPrayerTimes(): Observable<PrayerTime> {
    return this.http.get(`${this.PRAYER_API_URL}`, {
      params: {
        city: this.currentLocation.value.city,
        country: this.currentLocation.value.country,
        method: '2' // Islamic Society of North America
      }
    }).pipe(
      map((response: any) => ({
        fajr: response.data.timings.Fajr,
        sunrise: response.data.timings.Sunrise,
        dhuhr: response.data.timings.Dhuhr,
        asr: response.data.timings.Asr,
        maghrib: response.data.timings.Maghrib,
        isha: response.data.timings.Isha,
        date: response.data.date.readable
      }))
    );
  }

  getIslamicDate(): Observable<IslamicDate> {
    const today = new Date();
    return this.http.get(`${this.DATE_API_URL}`, {
      params: {
        date: `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
      }
    }).pipe(
      map((response: any) => ({
        hijri: response.data.hijri.date,
        gregorian: response.data.gregorian.date
      }))
    );
  }

  getNextPrayer(currentPrayerTimes: PrayerTime): { name: string; time: string } {
    const now = new Date();
    const times = [
      { name: 'Fajr', time: currentPrayerTimes.fajr },
      { name: 'Sunrise', time: currentPrayerTimes.sunrise },
      { name: 'Dhuhr', time: currentPrayerTimes.dhuhr },
      { name: 'Asr', time: currentPrayerTimes.asr },
      { name: 'Maghrib', time: currentPrayerTimes.maghrib },
      { name: 'Isha', time: currentPrayerTimes.isha }
    ];

    for (const prayer of times) {
      const prayerTime = new Date();
      const [hours, minutes] = prayer.time.split(':');
      prayerTime.setHours(parseInt(hours), parseInt(minutes));

      if (prayerTime > now) {
        return prayer;
      }
    }

    // If no next prayer today, return first prayer of next day
    return times[0];
  }

  updateLocation(city: string, country: string): void {
    this.currentLocation.next({ city, country });
  }

  getQiblaDirection(): number {
    // TODO: Implement actual Qibla calculation based on user's location
    return 119; // Example: London's Qibla direction
  }
}
