import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Verse {
  number: number;
  text: string;
  translation: string;
  audioUrl: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  verses: Verse[];
}

export interface Hadith {
  id: string;
  text: string;
  narrator: string;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuranService {
  private readonly API_URL = 'https://api.alquran.cloud/v1';
  private readonly AUDIO_URL = 'https://cdn.islamic.network/quran/audio/128';
  private bookmarks = new BehaviorSubject<number[]>(
    JSON.parse(localStorage.getItem('quranBookmarks') || '[]')
  );

  private dailyHadith: Hadith = {
    id: '1',
    text: 'The best among you is the one who learns the Quran and teaches it.',
    narrator: 'Uthman ibn Affan',
    source: 'Sahih al-Bukhari'
  };

  constructor(private http: HttpClient) {}

  getSurah(number: number): Observable<Surah> {
    return this.http.get(`${this.API_URL}/surah/${number}`).pipe(
      map((response: any) => ({
        number: response.data.number,
        name: response.data.name,
        englishName: response.data.englishName,
        verses: response.data.ayahs.map((ayah: any) => ({
          number: ayah.numberInSurah,
          text: ayah.text,
          translation: '', // Will be fetched separately
          audioUrl: `${this.AUDIO_URL}/${ayah.number}.mp3`
        }))
      }))
    );
  }

  getTranslation(surahNumber: number): Observable<any> {
    return this.http.get(`${this.API_URL}/surah/${surahNumber}/en.asad`).pipe(
      map((response: any) =>
        response.data.ayahs.map((ayah: any) => ({
          number: ayah.numberInSurah,
          text: ayah.text
        }))
      )
    );
  }

  getDailyHadith(): Observable<Hadith> {
    // In a real app, this would fetch from an API
    return of(this.dailyHadith);
  }

  getBookmarks(): Observable<number[]> {
    return this.bookmarks.asObservable();
  }

  toggleBookmark(verseNumber: number): void {
    const currentBookmarks = this.bookmarks.value;
    const updatedBookmarks = currentBookmarks.includes(verseNumber)
      ? currentBookmarks.filter(b => b !== verseNumber)
      : [...currentBookmarks, verseNumber];

    localStorage.setItem('quranBookmarks', JSON.stringify(updatedBookmarks));
    this.bookmarks.next(updatedBookmarks);
  }

  isBookmarked(verseNumber: number): boolean {
    return this.bookmarks.value.includes(verseNumber);
  }

  // Mock tafsir data - in real app, would fetch from API
  getTafsir(surahNumber: number, verseNumber: number): Observable<string> {
    return of('This verse explains the importance of seeking knowledge and understanding in Islam...');
  }
}
