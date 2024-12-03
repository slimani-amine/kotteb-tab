import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children, title }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          {children}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

interface QuranModalsProps {
  showSettings: boolean;
  showTranslation: boolean;
  showTafseer: boolean;
  onCloseSettings: () => void;
  onCloseTranslation: () => void;
  onCloseTafseer: () => void;
  playbackSpeed: number;
  onPlaybackSpeedChange: (speed: number) => void;
  currentTranslation: string;
  onTranslationChange: (lang: string) => void;
  verseTranslation?: string;
}

const PLAYBACK_SPEEDS = [
  { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" },
  { value: 1, label: "Normal" },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x" },
  { value: 2, label: "2x" },
];

export const QuranModals: React.FC<QuranModalsProps> = ({
  showSettings,
  showTranslation,
  showTafseer,
  onCloseSettings,
  onCloseTranslation,
  onCloseTafseer,
  playbackSpeed,
  onPlaybackSpeedChange,
  currentTranslation,
  onTranslationChange,
  verseTranslation,
}) => {
  return (
    <>
      <Modal show={showSettings} onClose={onCloseSettings} title="Recitation Settings">
        <div>
          <label className="block mb-2">Playback Speed</label>
          <select
            value={playbackSpeed}
            onChange={(e) => onPlaybackSpeedChange(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {PLAYBACK_SPEEDS.map((speed) => (
              <option key={speed.value} value={speed.value}>
                {speed.label}
              </option>
            ))}
          </select>
        </div>
      </Modal>

      <Modal show={showTranslation} onClose={onCloseTranslation} title="Verse Translation">
        <div className="mb-4">
          <label className="block mb-2">Language</label>
          <select
            value={currentTranslation}
            onChange={(e) => onTranslationChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="tr">Turkish</option>
          </select>
        </div>
        <p className="text-gray-700">
          {verseTranslation || "Translation not available"}
        </p>
      </Modal>

      <Modal show={showTafseer} onClose={onCloseTafseer} title="Tafseer (Exegesis)">
        <div className="mb-4">
          <label className="block mb-2">Language</label>
          <select
            value={currentTranslation}
            onChange={(e) => onTranslationChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
      </Modal>
    </>
  );
};
