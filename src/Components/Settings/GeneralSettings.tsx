import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { Switch } from '../ui/Switch';
import { tSafe } from '../../translations/i18nHelper';

const GeneralSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { settings, updateGeneralSettings } = useSettings();

  const handleToggle = (key: keyof typeof settings.general) => {
    updateGeneralSettings({ [key]: !settings.general[key] });
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {tSafe('settings.general.language')}
        </h3>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {tSafe('settings.general.selectLanguage')}
          </label>
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-[#FECA30] focus:ring-[#FECA30] sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>

      {/* Visibility Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {tSafe('settings.general.visibility')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tSafe('settings.general.showDateTime')}
            </label>
            <Switch
              checked={settings.general.showDateTime}
              onCheckedChange={() => handleToggle('showDateTime')}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tSafe('settings.general.showPrayerTimes')}
            </label>
            <Switch
              checked={settings.general.showPrayerTimes}
              onCheckedChange={() => handleToggle('showPrayerTimes')}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tSafe('settings.general.showQuran')}
            </label>
            <Switch
              checked={settings.general.showQuran}
              onCheckedChange={() => handleToggle('showQuran')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
