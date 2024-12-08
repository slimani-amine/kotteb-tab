import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Switch } from '../ui/Switch';
import { tSafe } from '../../translations/i18nHelper';

const RECITERS = [
  { id: 'Abdul_Basit_Murattal', name: 'Abdul Basit (Murattal)' },
  { id: 'Mishary_Rashid_Alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'Abu_Bakr_Ash-Shaatree', name: 'Abu Bakr Ash-Shaatree' },
];

const DEFAULT_VERSE_SETTINGS = {
  reciterId: 'Abdul_Basit_Murattal',
  recitationMode: 'verse' as const,
  showTranslation: true,
  showTafseer: false,
  translationLanguage: 'en',
};

const VerseSettings: React.FC = () => {
  const { settings, updateVerseSettings } = useSettings();
  const verseSettings = settings.verse || DEFAULT_VERSE_SETTINGS;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {tSafe('settings.verse.recitation')}
        </h3>
        
        {/* Reciter Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {tSafe('settings.verse.selectReciter')}
          </label>
          <select
            value={verseSettings.reciterId}
            onChange={(e) => updateVerseSettings({ reciterId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FECA30] focus:ring-[#FECA30] sm:text-sm dark:bg-gray-700 dark:border-gray-600"
          >
            {RECITERS.map((reciter) => (
              <option key={reciter.id} value={reciter.id}>
                {reciter.name}
              </option>
            ))}
          </select>
        </div>

        {/* Recitation Mode */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {tSafe('settings.verse.recitationMode')}
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-[#FECA30]"
                name="recitationMode"
                value="verse"
                checked={verseSettings.recitationMode === 'verse'}
                onChange={() => updateVerseSettings({ recitationMode: 'verse' })}
              />
              <span className="ml-2">{tSafe('settings.verse.verseMode')}</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-[#FECA30]"
                name="recitationMode"
                value="continuous"
                checked={verseSettings.recitationMode === 'continuous'}
                onChange={() => updateVerseSettings({ recitationMode: 'continuous' })}
              />
              <span className="ml-2">{tSafe('settings.verse.continuousMode')}</span>
            </label>
          </div>
        </div>

        {/* Translation and Tafseer Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tSafe('settings.verse.showTranslation')}
            </label>
            <Switch
              checked={verseSettings.showTranslation}
              onCheckedChange={(checked) => updateVerseSettings({ showTranslation: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tSafe('settings.verse.showTafseer')}
            </label>
            <Switch
              checked={verseSettings.showTafseer}
              onCheckedChange={(checked) => updateVerseSettings({ showTafseer: checked })}
            />
          </div>
        </div>

        {/* Translation Language */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {tSafe('settings.verse.translationLanguage')}
          </label>
          <select
            value={verseSettings.translationLanguage}
            onChange={(e) => updateVerseSettings({ translationLanguage: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FECA30] focus:ring-[#FECA30] sm:text-sm dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default VerseSettings;
