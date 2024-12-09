import React, { useState, useEffect, useRef } from "react";
import {
  IoSettingsOutline,
  IoVolumeHighOutline,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { tSafe } from "../translations/i18nHelper";
import { SettingsModal } from "./Settings/SettingsModal";
import { useTranslation } from "react-i18next";

interface SettingsProps {
  onVolumeChange: (volume: number) => void;
  onRecitationVolumeChange: (volume: number) => void;
  volume: number;
  recitationVolume: number;
  language: string;
  setLanguage: (language: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  onVolumeChange,
  onRecitationVolumeChange,
  volume,
  recitationVolume,
  language,
  setLanguage,
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recitationAudioRef = useRef<HTMLAudioElement | null>(null);

  // Close modal function
  const closeModal = () => {
    setIsOpen(false);
  };

  const closeVolumeModal = () => {
    setIsVolumeOpen(false);
  };

  // Effect to handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeVolumeModal();
      }
    };

    if (isVolumeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVolumeOpen]);

  // Effect to initialize and update audio element
  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio("/adhan.mp3");
    }

    // Update audio volume in real-time
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Effect to initialize and update recitation audio element
  useEffect(() => {
    // Initialize recitation audio element
    if (!recitationAudioRef.current) {
      recitationAudioRef.current = new Audio("/recitation.mp3"); // Placeholder for actual recitation audio
    }

    // Update recitation audio volume in real-time
    if (recitationAudioRef.current) {
      recitationAudioRef.current.volume = recitationVolume;
    }
  }, [recitationVolume]);

  // Volume change handler
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVolume = parseFloat(e.target.value);
    const normalizedVolume = rawVolume / 100;
    onVolumeChange(normalizedVolume);
  };

  // Recitation volume change handler
  const handleRecitationVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVolume = parseFloat(e.target.value);
    const normalizedVolume = rawVolume / 100;
    onRecitationVolumeChange(normalizedVolume);
  };

  // Test Adhan sound
  const testAdhan = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-50">
      <div className="flex gap-2">
        <button
          onClick={() => setIsVolumeOpen(!isVolumeOpen)}
          className="bg-black bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
        >
          <IoVolumeHighOutline className="h-6 w-6" title={isRTL ? "الصوت" : "Volume"}/>
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
        >
          <IoSettingsOutline className="h-6 w-6" title={isRTL ? "الإعدادات" : "Settings"}/>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && <SettingsModal isOpen={isOpen} onClose={closeModal} />}
      </AnimatePresence>
      <AnimatePresence>
        {isVolumeOpen && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 right-0 bg-black bg-opacity-80 rounded-lg p-4 w-64 text-white"
          >
            <label
              htmlFor="recitation-volume-slider"
              className="text-sm mb-2 block "
            >
              {tSafe("recitationVolume")}
            </label>
            <input
              id="recitation-volume-slider"
              type="range"
              min="0"
              max="100"
              value={recitationVolume * 100}
              onChange={handleRecitationVolumeChange}
              className="w-full"
            />
            <label htmlFor="volume-slider" className="text-sm mb-2 block">
              {tSafe("adhanvolume")}
            </label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={handleVolumeChange}
              className="w-full"
            />
            <button
              onClick={testAdhan}
              className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all w-full"
            >
              {tSafe("testAdhan")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
