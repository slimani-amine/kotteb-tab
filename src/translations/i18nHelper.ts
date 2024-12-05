import i18n from "i18next";

export type TranslationNamespace = 'common' | 'quran';

export const tSafe = (
  key: string,
  options?: {
    defaultValue?: string;
    ns?: TranslationNamespace;
  }
): string => {
  const defaultOptions = {
    defaultValue: '',
    ns: 'common' as TranslationNamespace
  };
  const finalOptions = { ...defaultOptions, ...options };
  // @ts-ignore
  const translation = i18n.t(key, finalOptions);
  return translation === key ? finalOptions.defaultValue : translation;
};

export const getCurrentLanguage = (): string => {
  return i18n.language || 'en';
};

export const isRTL = (): boolean => {
  const rtlLanguages = ['ar', 'fa', 'he', 'ur'];
  return rtlLanguages.includes(getCurrentLanguage());
};

export const changeLanguage = async (lang: string): Promise<void> => {
  await i18n.changeLanguage(lang);
  document.documentElement.dir = isRTL() ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};

export const getAvailableLanguages = (): { code: string; name: string }[] => {
  return [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' }
  ];
};
