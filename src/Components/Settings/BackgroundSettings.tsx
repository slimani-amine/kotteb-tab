import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { Switch } from '../ui/Switch';
import { tSafe } from '../../translations/i18nHelper';

const BackgroundSettings: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateBackgroundSettings } = useSettings();

  const handleBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    updateBackgroundSettings({ blur: value });
  };

  const handleSourceChange = (source: 'api' | 'custom') => {
    updateBackgroundSettings({ source });
  };

  const handleCustomImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBackgroundSettings({
          source: 'custom',
          customImageUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Background Visibility */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {tSafe('settings.background.show')}
        </label>
        <Switch
          checked={settings.background.show}
          onCheckedChange={(checked) => updateBackgroundSettings({ show: checked })}
        />
      </div>

      {/* Background Blur */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {tSafe('settings.background.blur')}
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="0"
            max="20"
            value={settings.background.blur}
            onChange={handleBlurChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-500">{settings.background.blur}px</span>
        </div>
      </div>

    </div>
  );
};

export default BackgroundSettings;
