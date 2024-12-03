import { openDB, DBSchema } from 'idb';
import { QuranData } from '../types/quran';

interface QuranDB extends DBSchema {
  ayahs: {
    key: number;
    value: { surah: number; ayah: number; text: string; };
    indexes: { 'by-surah': number; 'by-ayah': number; };
  };
  settings: {
    key: string;
    value: any;
  };
  quranData: {
    key: string;
    value: QuranData;
  };
}

const dbPromise = openDB<QuranDB>('quran-db', 2, {
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      const ayahStore = db.createObjectStore('ayahs', {
        keyPath: 'ayah',
        autoIncrement: true,
      });
      ayahStore.createIndex('by-surah', 'surah');
      ayahStore.createIndex('by-ayah', 'ayah');
      db.createObjectStore('settings');
    }
    if (oldVersion < 2) {
      db.createObjectStore('quranData');
    }
  },
});

export const IndexedDBService = {
  async addAyah(surah: number, ayah: number, text: string) {
    const db = await dbPromise;
    await db.add('ayahs', { surah, ayah, text });
  },

  async getAyah(surah: number, ayah: number) {
    const db = await dbPromise;
    return await db.getFromIndex('ayahs', 'by-ayah', ayah);
  },

  async saveSetting(key: string, value: any) {
    const db = await dbPromise;
    await db.put('settings', value, key);
  },

  async getSetting(key: string) {
    const db = await dbPromise;
    return await db.get('settings', key);
  },

  async saveQuranData(data: QuranData) {
    const db = await dbPromise;
    await db.put('quranData', data, 'quran');
  },

  async getQuranData(): Promise<QuranData | undefined> {
    const db = await dbPromise;
    return await db.get('quranData', 'quran');
  },

  async clearQuranData() {
    const db = await dbPromise;
    await db.clear('quranData');
  }
};
