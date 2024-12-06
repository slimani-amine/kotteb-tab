import React, { useState, useEffect, useRef } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { tSafe } from "../translations/i18nHelper";

export const AboutUs: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    // Add event listener when the modal is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="absolute bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
      >
        <IoInformationCircleOutline className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 left-0 bg-black bg-opacity-80 rounded-lg p-4 w-64 text-white"
          >
            <div className="space-y-4">
              <h2 className="text-lg font-bold">{tSafe("aboutUsTitle")}</h2>
              <p className="text-sm">
                {tSafe("aboutUsDescription", {
                  defaultValue:
                    "This application provides prayer times, Quran recitation, and Islamic tools to enhance your daily life.",
                })}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
