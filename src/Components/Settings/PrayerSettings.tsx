import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { tSafe } from '../../translations/i18nHelper';

const CALCULATION_METHODS = [
  { id: 'MWL', name: 'Muslim World League' },
  { id: 'ISNA', name: 'Islamic Society of North America' },
  { id: 'Egypt', name: 'Egyptian General Authority of Survey' },
  { id: 'Makkah', name: 'Umm Al-Qura University, Makkah' },
  { id: 'Karachi', name: 'University of Islamic Sciences, Karachi' },
];

const PRAYER_TIMES = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

const DEFAULT_ADJUSTMENTS = {
  fajr: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
};

const PrayerSettings: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updatePrayerSettings } = useSettings();
  const adjustments = settings.prayer?.adjustments || DEFAULT_ADJUSTMENTS;

  const handleAdjustmentChange = (prayer: typeof PRAYER_TIMES[number], value: string) => {
    const numValue = parseInt(value) || 0;
    updatePrayerSettings({
      adjustments: {
        ...adjustments,
        [prayer]: numValue,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Location Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {tSafe('settings.prayer.location')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {tSafe('settings.prayer.country')}
            </label>
            <input
              type="text"
              value={settings.prayer?.country || ''}
              onChange={(e) => updatePrayerSettings({ country: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FECA30] focus:ring-[#FECA30] sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {tSafe('settings.prayer.city')}
            </label>
            <input
              type="text"
              value={settings.prayer?.city || ''}
              onChange={(e) => updatePrayerSettings({ city: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FECA30] focus:ring-[#FECA30] sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Calculation Method */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {tSafe('settings.prayer.calculationMethod')}
        </h3>
        <select
          value={settings.prayer?.calculationMethod || 'MWL'}
          onChange={(e) => updatePrayerSettings({ calculationMethod: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FECA30] focus:ring-[#FECA30] sm:text-sm"
        >
          {CALCULATION_METHODS.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>
      </div>

      {/* Time Adjustments */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {tSafe('settings.prayer.timeAdjustments')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {PRAYER_TIMES.map((prayer) => (
            <div key={prayer}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {tSafe(`settings.prayer.${prayer}`)}
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  value={adjustments[prayer]}
                  onChange={(e) => handleAdjustmentChange(prayer, e.target.value)}
                  min="-60"
                  max="60"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FECA30] focus:ring-[#FECA30] sm:text-sm"
                />

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrayerSettings;
