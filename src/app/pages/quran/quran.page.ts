import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuranService, Surah, Verse, Hadith } from '../../services/quran/quran.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quran',
  templateUrl: './quran.page.html',
  styleUrls: ['./quran.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule]
})
export class QuranPage implements OnInit {
  currentSurah: Surah | null = null;
  dailyHadith$: Observable<Hadith>;
  selectedVerse: Verse | null = null;
  audioPlayer: HTMLAudioElement | null = null;
  bookmarks$: Observable<number[]>;
  showTafsir: boolean = false;
  tafsirText: string = '';
  currentSurahNumber: number = 1;

  constructor(private quranService: QuranService) {
    this.dailyHadith$ = this.quranService.getDailyHadith();
    this.bookmarks$ = this.quranService.getBookmarks();
  }

  ngOnInit() {
    this.loadSurah(this.currentSurahNumber);
  }

  loadSurah(number: number) {
    this.quranService.getSurah(number).subscribe(surah => {
      this.currentSurah = surah;
      // Load translations
      this.quranService.getTranslation(number).subscribe(translations => {
        if (this.currentSurah) {
          this.currentSurah.verses = this.currentSurah.verses.map((verse, index) => ({
            ...verse,
            translation: translations[index].text
          }));
        }
      });
    });
  }

  playAudio(verse: Verse) {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
    }
    this.audioPlayer = new Audio(verse.audioUrl);
    this.audioPlayer.play();
  }

  toggleBookmark(verseNumber: number) {
    this.quranService.toggleBookmark(verseNumber);
  }

  isBookmarked(verseNumber: number): boolean {
    return this.quranService.isBookmarked(verseNumber);
  }

  showTafsirFor(surahNumber: number, verseNumber: number) {
    this.quranService.getTafsir(surahNumber, verseNumber).subscribe(tafsir => {
      this.tafsirText = tafsir;
      this.showTafsir = true;
    });
  }

  nextSurah() {
    if (this.currentSurahNumber < 114) {
      this.currentSurahNumber++;
      this.loadSurah(this.currentSurahNumber);
    }
  }

  previousSurah() {
    if (this.currentSurahNumber > 1) {
      this.currentSurahNumber--;
      this.loadSurah(this.currentSurahNumber);
    }
  }
}
