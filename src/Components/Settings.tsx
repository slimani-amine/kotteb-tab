import React, { useState, useEffect } from "react";
import {
  IoSettingsOutline,
  IoVolumeHighOutline,
  IoVolumeMuteOutline,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { tSafe } from "../translations/i18nHelper";

interface SettingsProps {
  isSoundEnabled: boolean;
  onSoundToggle: () => void;
  onVolumeChange: (volume: number) => void;
  volume: number;
  language: string;
  setLanguage: (language: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  isSoundEnabled,
  onSoundToggle,
  onVolumeChange,
  volume,
  language,
  setLanguage,
}) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [arabicDate, setArabicDate] = useState("");

  const changeLanguage = (lng: string) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      calendar: "islamic",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const hijriDate = new Intl.DateTimeFormat("ar-SA", options).format(
      date
    );
    setArabicDate(hijriDate);
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const testAdhan = () => {
    const audio = new Audio("/adhan.mp3");
    audio.volume = volume;
    audio.play();
  };

  return (
    <div className="absolute bottom-4 right-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
      >
        <IoSettingsOutline className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 right-0 bg-black bg-opacity-80 rounded-lg p-4 w-64 text-white"
          >
            <div className="space-y-4">
              {/* Language Switcher */}
              <div className="flex justify-between items-center w-full gap-2">
                {["en", "fr", "ar"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-4 py-2 rounded w-1/3 ${
                      language === lang
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Sound Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{tSafe("adhanSound")}</span>
                  <button
                    onClick={onSoundToggle}
                    className={`px-4 py-2 rounded ${
                      isSoundEnabled
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {isSoundEnabled ? tSafe("soundOn") : tSafe("soundOff")}
                  </button>
                </div>

                <button
                  onClick={testAdhan}
                  disabled={!isSoundEnabled}
                  className={`px-4 py-2 rounded ${
                    isSoundEnabled
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {tSafe("testAdhan")}
                </button>

                {/* Volume Slider */}
                {isSoundEnabled && (
                  <div className="space-y-1">
                    <label htmlFor="volume" className="block mb-2">
                      {tSafe("volume")}
                    </label>
                    <input
                      type="range"
                      id="volume"
                      min="0"
                      max="100"
                      value={volume * 100}
                      onChange={handleVolumeChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">
                      {volume * 100}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
