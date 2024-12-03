import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  MdContentCopy,
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdSkipPrevious,
  MdFavorite,
  MdFavoriteBorder,
  MdSettings,
  MdTranslate,
  MdInfoOutline,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useAxios } from "../Hooks";
import { QURAN } from "../Urls";
import { ResponseType } from "../types";
import { QuranData, QuranSurah, QuranVerse, Recitation } from "../types/quran";
import { IndexedDBService } from '../services/indexedDB';

// Playback Speeds
const PLAYBACK_SPEEDS = [
  { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" },
  { value: 1, label: "Normal" },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x" },
  { value: 2, label: "2x" },
];

export const Quran: React.FC = () => {
  const [currentReciter, setCurrentReciter] = useState(1);
  const [currentTranslation, setCurrentTranslation] = useState("en");
  const [recitationMode, setRecitationMode] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState<
    Array<{ surah: number; verse: number }>
  >([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showTafseer, setShowTafseer] = useState(false);

  const [verseData, setVerseData] = useState({
    arabic: "",
    translations: {},
    transliteration: "",
    audioUrl: "",
    tafseer: {},
  }) as any;

  const basmalah = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [qurans, setQurans] = useState<QuranData | null>(null);
  const [currentRecitation, setCurrentRecitation] = useState<Recitation | null>(
    null
  );
  const [currentSurah, setCurrentSurah] = useState<QuranSurah | null>(null);
  const [currentVerse, setCurrentVerse] = useState<QuranVerse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [res, loading, error] = useAxios({
    method: "get",
    url: QURAN,
  });

  const response = res as ResponseType | undefined;

  // Load initial verse from IndexedDB
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        // Get cached Quran data
        const cachedQuranData = await IndexedDBService.getQuranData();
        if (cachedQuranData) {
          setQurans(cachedQuranData);
          const initialRecitation = cachedQuranData.recitations[0];
          setCurrentRecitation(initialRecitation);
          
          // Get last verse position
          const savedVersePosition = await IndexedDBService.getSetting('versePosition') || { surahId: 1, verseId: 1 };
          
          // Calculate next verse position
          let nextSurahId = savedVersePosition.surahId;
          let nextVerseId = savedVersePosition.verseId;
          
          const currentSurah = initialRecitation.surah.find(s => s.surahId === savedVersePosition.surahId);
          if (currentSurah) {
            if (nextVerseId < currentSurah.verses.length) {
              nextVerseId++;
            } else {
              // Move to next surah
              const nextSurahIndex = initialRecitation.surah.findIndex(s => s.surahId === savedVersePosition.surahId) + 1;
              if (nextSurahIndex < initialRecitation.surah.length) {
                nextSurahId = initialRecitation.surah[nextSurahIndex].surahId;
                nextVerseId = 1;
              } else {
                // If we're at the end, start from beginning
                nextSurahId = 1;
                nextVerseId = 1;
              }
            }
          }

          // Save next verse position
          await IndexedDBService.saveSetting('versePosition', {
            surahId: nextSurahId,
            verseId: nextVerseId
          });

          // Set the states
          const nextSurah = initialRecitation.surah.find(s => s.surahId === nextSurahId);
          if (nextSurah) {
            setCurrentSurah(nextSurah);
            const verse = nextSurah.verses.find(v => v.verseId === nextVerseId);
            if (verse) {
              setCurrentVerse(verse);
            }
          }
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error loading from IndexedDB:', error);
      }
    };
    loadInitialState();
  }, []);

  // Handle API response and cache data
  useEffect(() => {
    const handleResponse = async () => {
      if (response?.data) {
        const quranData = response.data as QuranData;
        
        try {
          // Cache Quran data
          await IndexedDBService.saveQuranData(quranData);
          setQurans(quranData);

          // Set initial recitation
          if (quranData.recitations.length > 0) {
            const initialRecitation = quranData.recitations[0];
            setCurrentRecitation(initialRecitation);

            // Get saved position or start from first verse
            const savedVersePosition = await IndexedDBService.getSetting('versePosition');
            const position = savedVersePosition || { surahId: 1, verseId: 1 };

            if (!savedVersePosition) {
              await IndexedDBService.saveSetting('versePosition', position);
            }
            
            const initialSurah = initialRecitation.surah.find(s => s.surahId === position.surahId);
            if (initialSurah) {
              setCurrentSurah(initialSurah);
              const verse = initialSurah.verses.find(v => v.verseId === position.verseId);
              if (verse) {
                setCurrentVerse(verse);
              }
            }
          }
        } catch (error) {
          console.error('Error caching Quran data:', error);
        }
        setIsLoading(false);
      }
    };
    handleResponse();
  }, [response]);

  const goToNextVerse = async () => {
    if (!currentSurah || !currentVerse || !currentRecitation) return;
    
    const currentVerseIndex = currentSurah.verses.findIndex(v => v.verseId === currentVerse.verseId);
    
    if (currentVerseIndex < currentSurah.verses.length - 1) {
      // Next verse in current surah
      setCurrentVerse(currentSurah.verses[currentVerseIndex + 1]);
    } else {
      // Move to next surah
      const currentSurahIndex = currentRecitation.surah.findIndex(s => s.surahId === currentSurah.surahId);
      if (currentSurahIndex < currentRecitation.surah.length - 1) {
        const nextSurah = currentRecitation.surah[currentSurahIndex + 1];
        setCurrentSurah(nextSurah);
        if (nextSurah.verses.length > 0) {
          setCurrentVerse(nextSurah.verses[0]);
        }
      }
    }
  };

  const goToPreviousVerse = () => {
    if (!currentSurah || !currentVerse || !currentRecitation) return;
    
    const currentVerseIndex = currentSurah.verses.findIndex(v => v.verseId === currentVerse.verseId);
    
    if (currentVerseIndex > 0) {
      // Previous verse in current surah
      setCurrentVerse(currentSurah.verses[currentVerseIndex - 1]);
    } else {
      // Move to previous surah
      const currentSurahIndex = currentRecitation.surah.findIndex(s => s.surahId === currentSurah.surahId);
      if (currentSurahIndex > 0) {
        const prevSurah = currentRecitation.surah[currentSurahIndex - 1];
        setCurrentSurah(prevSurah);
        if (prevSurah.verses.length > 0) {
          setCurrentVerse(prevSurah.verses[prevSurah.verses.length - 1]);
        }
      }
    }
  };

  // Audio Speed Control
  useEffect(() => {
    if (currentSurah && audioRef.current) {
      audioRef.current.src = currentSurah.audioUrl;
      audioRef.current.load();
    }
  }, [currentSurah]);

  useEffect(() => {
    if (audioRef.current && currentVerse) {
      audioRef.current.currentTime = timeToSeconds(currentVerse.startTime);
    }
  }, [currentVerse]);

  const timeToSeconds = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(parseFloat);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Audio Playback Handlers
  const handleAudioPlay = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // Navigation Handlers
  const handleNextVerse = () => {
    goToNextVerse();
  };

  const handlePreviousVerse = () => {
    goToPreviousVerse();
  };

  const handleToggleFavorite = () => {
    if (!currentSurah || !currentVerse) return;

    const favoriteItem = {
      surah: currentSurah.surahId,
      verse: currentVerse.verseId,
    };

    if (isFavorite) {
      setFavorites(
        favorites.filter(
          (fav) =>
            !(
              fav.surah === favoriteItem.surah &&
              fav.verse === favoriteItem.verse
            )
        )
      );
      toast.info("Verse removed from favorites");
    } else {
      setFavorites([...favorites, favoriteItem]);
      toast.success("Verse added to favorites");
    }

    setIsFavorite(!isFavorite);
  };

  const handleCopyToClipboard = () => {
    if (!currentVerse) return;
    const text = currentVerse.text;
    navigator.clipboard.writeText(text);
    toast.success("Verse copied to clipboard!");
  };

  // Render Methods
  const renderSettingsModal = () => (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Recitation Settings</h2>

            {/* Playback Speed */}
            <div>
              <label className="block mb-2">Playback Speed</label>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="w-full p-2 border rounded"
              >
                {PLAYBACK_SPEEDS.map((speed) => (
                  <option key={speed.value} value={speed.value}>
                    {speed.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowSettings(false)}
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

  const renderTranslationModal = () => (
    <AnimatePresence>
      {showTranslation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Verse Translation</h2>

            <div className="mb-4">
              <label className="block mb-2">Language</label>
              <select
                value={currentTranslation}
                onChange={(e) => setCurrentTranslation(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="tr">Turkish</option>
              </select>
            </div>

            <p className="text-gray-700">
              {verseData.translations[currentTranslation] ||
                "Translation not available"}
            </p>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowTranslation(false)}
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

  const renderTafseerModal = () => (
    <AnimatePresence>
      {showTafseer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Tafseer (Exegesis)</h2>

            <div className="mb-4">
              <label className="block mb-2">Language</label>
              <select
                value={currentTranslation}
                onChange={(e) => setCurrentTranslation(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>

            {/* <p className="text-gray-700">
              {SURAHS.find((s) => s.id === currentSurah)?.tafseer[
                currentTranslation
              ] || "Tafseer not available"}
            </p> */}

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowTafseer(false)}
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
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500"></div>
    </div>
  );

  const ErrorMessage = () => (
    <div className="text-red-500 text-center p-4">
      Error loading Quran data. Please try again later.
    </div>
  );
  return (
    <div className="flex justify-center m-0">
      {renderSettingsModal()}
      {renderTranslationModal()}
      {renderTafseerModal()}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
       <ErrorMessage />
      ) : (
        <div className="bg-black bg-opacity-60 rounded-lg p-6 w-[1000px] text-white">
          <div className="text-center flex flex-col gap-12">
            {/* Show Basmalah except for Surah 9 */}
            {currentSurah?.surahId !== 9 && (
              <p className="text-yellow-500 text-[2rem] font-QuranFont">
                {basmalah}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-4">
                <MdContentCopy
                  onClick={handleCopyToClipboard}
                  className="w-[2rem] h-[2rem] cursor-pointer text-gray-300 hover:bg-gray-700 hover:rounded-md p-1 mr-2"
                />
                <p className="text-white text-[3rem] font-QuranFont">
                  {currentVerse?.text}
                </p>
              </div>

              {/* <p className="text-lg">
              {SURAHS.find((s) => s.id === currentSurah?.surahId)?.nameEn} (
              {currentSurah?.surahId}:{currentVerse?.verseId})
            </p> */}
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center items-center space-x-4 ">
              <MdInfoOutline
                onClick={() => setShowTafseer(true)}
                className="w-8 h-8 cursor-pointer hover:text-yellow-500"
              />
              {isFavorite ? (
                <MdFavorite
                  onClick={handleToggleFavorite}
                  className="w-8 h-8 text-red-500 cursor-pointer hover:text-red-600"
                />
              ) : (
                <MdFavoriteBorder
                  onClick={handleToggleFavorite}
                  className="w-8 h-8 text-white cursor-pointer hover:text-red-500"
                />
              )}
              <MdSkipPrevious
                onClick={handlePreviousVerse}
                className="w-8 h-8 cursor-pointer hover:text-yellow-500"
              />
              {isPlaying ? (
                <MdPause
                  onClick={handleAudioPlay}
                  className="w-10 h-10 cursor-pointer text-yellow-500"
                />
              ) : (
                <MdPlayArrow
                  onClick={handleAudioPlay}
                  className="w-10 h-10 cursor-pointer text-yellow-500"
                />
              )}
              <MdSkipNext
                onClick={handleNextVerse}
                className="w-8 h-8 cursor-pointer hover:text-yellow-500"
              />

              {/* Additional Controls */}
              <MdSettings
                onClick={() => setShowSettings(true)}
                className="w-8 h-8 cursor-pointer hover:text-yellow-500"
              />
              <MdTranslate
                onClick={() => setShowTranslation(true)}
                className="w-8 h-8 cursor-pointer hover:text-yellow-500"
              />
            </div>

            {/* Audio Player */}
            <audio
              ref={audioRef}
              onEnded={() => setIsPlaying(false)}
              onTimeUpdate={() => {
                if (
                  audioRef.current &&
                  currentVerse &&
                  timeToSeconds(currentVerse.endTime) <=
                    audioRef.current.currentTime
                ) {
                  handleNextVerse();
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Quran;
