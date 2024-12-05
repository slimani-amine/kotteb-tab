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

      {/* Background Source */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {tSafe('settings.background.source')}
        </label>
        <div className="space-y-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-[#FECA30]"
              name="backgroundSource"
              checked={settings.background.source === 'api'}
              onChange={() => handleSourceChange('api')}
            />
            <span className="ml-2">{tSafe('settings.background.useApi')}</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-[#FECA30]"
              name="backgroundSource"
              checked={settings.background.source === 'custom'}
              onChange={() => handleSourceChange('custom')}
            />
            <span className="ml-2">{tSafe('settings.background.useCustom')}</span>
          </label>
        </div>
      </div>

      {/* Custom Image Upload */}
      {settings.background.source === 'custom' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {tSafe('settings.background.customImage')}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCustomImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FECA30] file:text-white hover:file:opacity-80"
          />
        </div>
      )}
    </div>
  );
};

export default BackgroundSettings;
