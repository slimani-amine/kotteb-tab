export interface QuranVerse {
  verseId: number;
  startTime: string;
  endTime: string;
  key: string;
  text: string;
  _id: string;
}

export interface QuranSurah {
  surahId: number;
  audioUrl: string;
  verses: QuranVerse[];
  _id: string;
}

export interface Recitation {
  _id: string;
  reciter: string;
  riwayat: string;
  surah: QuranSurah[];
}

export interface QuranData {
  recitations: Recitation[];
}
