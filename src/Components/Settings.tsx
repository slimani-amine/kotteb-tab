import React, { useState, useEffect, useRef } from "react";
import {
  IoSettingsOutline,
  IoVolumeHighOutline,
  IoVolumeMuteOutline,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { tSafe } from "../translations/i18nHelper";
import { SettingsModal } from "./Settings/SettingsModal";

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
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Change language and update i18n
  const changeLanguage = (lng: string) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
  };

  // Close modal function
  const closeModal = () => {
    setIsOpen(false);
  };

  // Effect to handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Volume change handler
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVolume = parseFloat(e.target.value);
    const normalizedVolume = rawVolume / 100;
    onVolumeChange(normalizedVolume);
  };

  // Test Adhan sound
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
        {isOpen && <SettingsModal isOpen={isOpen} onClose={closeModal} />}
      </AnimatePresence>
    </div>
  );
};
