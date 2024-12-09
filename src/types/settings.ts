export interface GeneralSettings {
  showDateTime: boolean;
  showPrayerTimes: boolean;
  showQuran: boolean;
}

export interface VerseSettings {
  reciterId: string;
  recitationMode: 'verse' | 'continuous';
  showTranslation: boolean;
  showTafseer: boolean;
  translationLanguage: string;
}

export interface PrayerSettings {
  country: string;
  city: string;
  calculationMethod: string;
  adjustments: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
}

export interface BackgroundSettings {
  show: boolean;
  blur: number;
  source: 'api' | 'custom';
  customImageUrl?: string;
  backgroundColor: string;
}

export interface AppSettings {
  general: GeneralSettings;
  verse: VerseSettings;
  prayer: PrayerSettings;
  background: BackgroundSettings;
}

export const DEFAULT_SETTINGS: AppSettings = {
  general: {
    showDateTime: true,
    showPrayerTimes: true,
    showQuran: true,
  },
  verse: {
    reciterId: 'Abdul_Basit_Murattal',
    recitationMode: 'verse',
    showTranslation: true,
    showTafseer: true,
    translationLanguage: 'en',
  },
  prayer: {
    country: '',
    city: '',
    calculationMethod: 'MWL',
    adjustments: {
      fajr: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
    },
  },
  background: {
    show: true,
    blur: 0,
    source: 'api',
    backgroundColor: '#000000',
  },
};
