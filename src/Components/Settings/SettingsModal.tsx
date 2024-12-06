import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import GeneralSettings from './GeneralSettings';
import VerseSettings from './VerseSettings';
import PrayerSettings from './PrayerSettings';
import BackgroundSettings from './BackgroundSettings';
import { tSafe } from '../../translations/i18nHelper';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsTabs = [
  { id: 'general', label: 'settings.tabs.general' },
  { id: 'verse', label: 'settings.tabs.verse' },
  { id: 'prayer', label: 'settings.tabs.prayer' },
  { id: 'background', label: 'settings.tabs.background' },
] as const;

type SettingsTab = typeof SettingsTabs[number]['id'];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const { settings } = useSettings();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'verse':
        return <VerseSettings />;
      case 'prayer':
        return <PrayerSettings />;
      case 'background':
        return <BackgroundSettings />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl  overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {tSafe('settings.title')}
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 ">
              {SettingsTabs.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === id
                      ? 'text-[#FECA30] border-b-2 border-[#FECA30]'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tSafe(label)}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 h-[250px] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400"
              >
                {tSafe('close')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
