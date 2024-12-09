import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Switch } from '../ui/Switch';
import { tSafe } from '../../translations/i18nHelper';

const BackgroundSettings: React.FC = () => {
  const { settings, updateBackgroundSettings } = useSettings();

  const handleBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    updateBackgroundSettings({ blur: value });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateBackgroundSettings({ backgroundColor: value });
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

      {settings.background.show ? (
        <>
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">{settings.background.blur}px</span>
            </div>
          </div>
        </>
      ) : (
        /* Background Color */
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {tSafe('settings.background.color')}
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              value={settings.background.backgroundColor}
              onChange={handleColorChange}
              className="h-8 w-16 rounded cursor-pointer"
            />

          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundSettings;
