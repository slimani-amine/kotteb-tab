import React, { useState, useEffect, useRef } from "react";
import { IoListSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { tSafe } from "../translations/i18nHelper";
import { IndexedDBService } from "../services/indexedDB";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { QuranRef } from "./Quran";
import { useTranslation } from "react-i18next";

interface FavoritesProps {
  quranRef: React.RefObject<QuranRef>;
}

export const Favorites: React.FC<FavoritesProps> = ({ quranRef }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [favorites, setFavorites] = useState<
    Array<{ id: string; surah: number; verse: number; text: string }>
  >([]);
  const [currentSurah, setCurrentSurah] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const closeModal = () => {
    setIsOpen(false);
  };

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

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favs = await IndexedDBService.getFavorites();
        setFavorites(favs);
        if (favs.length > 0) {
          setCurrentSurah(favs[0].surah);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen]);

  const surahList = Array.from(new Set(favorites.map((fav) => fav.surah)));

  const handleSurahChange = (direction: "next" | "prev") => {
    const currentIndex = surahList.indexOf(currentSurah!);
    if (direction === "next" && currentIndex < surahList.length - 1) {
      setCurrentSurah(surahList[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      setCurrentSurah(surahList[currentIndex - 1]);
    }
  };

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
        title={tSafe("favorites.title")}
      >
        <IoListSharp className="h-6 w-6" title={isRTL ? "المفضلة" : "Favorites"}/>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 left-0 bg-black bg-opacity-80 rounded-lg p-4 w-[350px] h-[320px] text-white"
          >
            <div className="space-y-4">
              {favorites.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    {tSafe("favorites.title")}
                  </h3>
                  <div className="space-y-3 overflow-y-auto custom-scrollbar h-[200px]">
                    {favorites
                      .filter((fav) => fav.surah === currentSurah)
                      .map((fav) => (
                        <div
                          key={fav.id}
                          className="bg-black bg-opacity-40 p-3 rounded hover:bg-opacity-50 transition-all cursor-pointer"
                          onClick={() => {
                            quranRef.current?.navigateToVerse(
                              fav.surah,
                              fav.verse
                            );
                            setIsOpen(false);
                          }}
                          title={`${tSafe("surah")} ${fav.surah}, ${tSafe(
                            "verse"
                          )} ${fav.verse}`}
                        >
                          <div className="text-right mb-2 font-arabic text-lg leading-loose hover:underline">
                            {fav.text}
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            {tSafe("surah")} {fav.surah}, {tSafe("verse")}{" "}
                            {fav.verse}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-center mt-4 space-x-4">
                    <button
                      onClick={() => handleSurahChange("prev")}
                      className={`bg-gray-700 p-2 rounded-full ${
                        surahList.indexOf(currentSurah!) === 0
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                      disabled={surahList.indexOf(currentSurah!) === 0}
                      title={tSafe("previous")}
                    >
                      <MdNavigateBefore
                        className="h-5 w-5"
                        title={isRTL ? "السابق" : "Previous"}
                      />
                    </button>
                    <span className="text-sm text-gray-300">
                      {tSafe("surah")} {currentSurah}
                    </span>
                    <button
                      onClick={() => handleSurahChange("next")}
                      className={`bg-gray-700 p-2 rounded-full ${
                        surahList.indexOf(currentSurah!) ===
                        surahList.length - 1
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                      disabled={
                        surahList.indexOf(currentSurah!) ===
                        surahList.length - 1
                      }
                      title={tSafe("next")}
                    >
                      <MdNavigateNext
                        className="h-5 w-5"
                        title={isRTL ? "التالي" : "Next"}
                      />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  {tSafe("favorites.empty")}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
