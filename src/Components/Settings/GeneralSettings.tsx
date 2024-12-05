import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { Switch } from '../ui/Switch';
import { tSafe } from '../../translations/i18nHelper';

const GeneralSettings: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateGeneralSettings } = useSettings();

  const handleToggle = (key: keyof typeof settings.general) => {
    updateGeneralSettings({ [key]: !settings.general[key] });
  };

  return (
    <div className="space-y-6">
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
              {tSafe('settings.general.showHijriDate')}
            </label>
            <Switch
              checked={settings.general.showHijriDate}
              onCheckedChange={() => handleToggle('showHijriDate')}
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
