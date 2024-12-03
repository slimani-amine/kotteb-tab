import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAxios } from "../Hooks";
import { QURAN } from "../Urls";
import { ResponseType } from "../types";
import { QuranData, QuranSurah, QuranVerse, Recitation } from "../types/quran";
import { IndexedDBService } from "../services/indexedDB";
import { QuranModals } from "./Quran/QuranModals";
import { ErrorMessage, LoadingSpinner } from "./Quran/QuranLoading";
import { QuranDisplay } from "./Quran/QuranDisplay";
import { QuranControls } from "./Quran/QuranControls";
import { QuranAudioPlayer } from "./Quran/QuranAudioPlayer";


export const Quran: React.FC = () => {
  const [currentReciter, setCurrentReciter] = useState(1);
  const [currentTranslation, setCurrentTranslation] = useState("en");
  const [recitationMode, setRecitationMode] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState<Array<{ surah: number; verse: number }>>([]);
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

  const [qurans, setQurans] = useState<QuranData | null>(null);
  const [currentRecitation, setCurrentRecitation] = useState<Recitation | null>(null);
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
        const cachedQuranData = await IndexedDBService.getQuranData();
        if (cachedQuranData) {
          setQurans(cachedQuranData);
          const initialRecitation = cachedQuranData.recitations[0];
          setCurrentRecitation(initialRecitation);

          const savedVersePosition = (await IndexedDBService.getSetting("versePosition")) || {
            surahId: 1,
            verseId: 1,
          };

          let nextSurahId = savedVersePosition.surahId;
          let nextVerseId = savedVersePosition.verseId;

          const currentSurah = initialRecitation.surah.find(
            (s) => s.surahId === savedVersePosition.surahId
          );
          if (currentSurah) {
            if (nextVerseId < currentSurah.verses.length) {
              nextVerseId++;
            } else {
              const nextSurahIndex =
                initialRecitation.surah.findIndex(
                  (s) => s.surahId === savedVersePosition.surahId
                ) + 1;
              if (nextSurahIndex < initialRecitation.surah.length) {
                nextSurahId = initialRecitation.surah[nextSurahIndex].surahId;
                nextVerseId = 1;
              } else {
                nextSurahId = 1;
                nextVerseId = 1;
              }
            }
          }

          await IndexedDBService.saveSetting("versePosition", {
            surahId: nextSurahId,
            verseId: nextVerseId,
          });

          const nextSurah = initialRecitation.surah.find((s) => s.surahId === nextSurahId);
          if (nextSurah) {
            setCurrentSurah(nextSurah);
            const verse = nextSurah.verses.find((v) => v.verseId === nextVerseId);
            if (verse) {
              setCurrentVerse(verse);
            }
          }
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error loading from IndexedDB:", error);
      }
    };
    loadInitialState();
  }, []);

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.data) {
        const quranData = response.data as QuranData;
        try {
          await IndexedDBService.saveQuranData(quranData);
          setQurans(quranData);

          if (quranData.recitations.length > 0) {
            const initialRecitation = quranData.recitations[0];
            setCurrentRecitation(initialRecitation);

            const savedVersePosition = await IndexedDBService.getSetting("versePosition");
            const position = savedVersePosition || { surahId: 1, verseId: 1 };

            if (!savedVersePosition) {
              await IndexedDBService.saveSetting("versePosition", position);
            }

            const initialSurah = initialRecitation.surah.find(
              (s) => s.surahId === position.surahId
            );
            if (initialSurah) {
              setCurrentSurah(initialSurah);
              const verse = initialSurah.verses.find(
                (v) => v.verseId === position.verseId
              );
              if (verse) {
                setCurrentVerse(verse);
              }
            }
          }
        } catch (error) {
          console.error("Error caching Quran data:", error);
        }
        setIsLoading(false);
      }
    };
    handleResponse();
  }, [response]);

  const goToNextVerse = async () => {
    if (!currentSurah || !currentVerse || !currentRecitation) return;

    const currentVerseIndex = currentSurah.verses.findIndex(
      (v) => v.verseId === currentVerse.verseId
    );

    if (currentVerseIndex < currentSurah.verses.length - 1) {
      setCurrentVerse(currentSurah.verses[currentVerseIndex + 1]);
    } else {
      const currentSurahIndex = currentRecitation.surah.findIndex(
        (s) => s.surahId === currentSurah.surahId
      );
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

    const currentVerseIndex = currentSurah.verses.findIndex(
      (v) => v.verseId === currentVerse.verseId
    );

    if (currentVerseIndex > 0) {
      setCurrentVerse(currentSurah.verses[currentVerseIndex - 1]);
    } else {
      const currentSurahIndex = currentRecitation.surah.findIndex(
        (s) => s.surahId === currentSurah.surahId
      );
      if (currentSurahIndex > 0) {
        const prevSurah = currentRecitation.surah[currentSurahIndex - 1];
        setCurrentSurah(prevSurah);
        if (prevSurah.verses.length > 0) {
          setCurrentVerse(prevSurah.verses[prevSurah.verses.length - 1]);
        }
      }
    }
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
          (fav) => !(fav.surah === favoriteItem.surah && fav.verse === favoriteItem.verse)
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

  return (
    <div className="flex justify-center m-0">
      <QuranModals
        showSettings={showSettings}
        showTranslation={showTranslation}
        showTafseer={showTafseer}
        onCloseSettings={() => setShowSettings(false)}
        onCloseTranslation={() => setShowTranslation(false)}
        onCloseTafseer={() => setShowTafseer(false)}
        playbackSpeed={playbackSpeed}
        onPlaybackSpeedChange={setPlaybackSpeed}
        currentTranslation={currentTranslation}
        onTranslationChange={setCurrentTranslation}
        verseTranslation={verseData.translations[currentTranslation]}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage />
      ) : (
        <div className="bg-black bg-opacity-60 rounded-lg p-6 w-[1000px] text-white">
          <QuranDisplay
            basmalah={basmalah}
            surahId={currentSurah?.surahId}
            verseText={currentVerse?.text}
            verseId={currentVerse?.verseId}
          />

          <QuranControls
            isPlaying={isPlaying}
            isFavorite={isFavorite}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={goToNextVerse}
            onPrevious={goToPreviousVerse}
            onToggleFavorite={handleToggleFavorite}
            onOpenSettings={() => setShowSettings(true)}
            onOpenTranslation={() => setShowTranslation(true)}
            onCopy={handleCopyToClipboard}
            onOpenTafseer={() => setShowTafseer(true)}
          />

          <QuranAudioPlayer
            audioUrl={currentSurah?.audioUrl}
            isPlaying={isPlaying}
            onEnded={() => setIsPlaying(false)}
            currentVerseEndTime={currentVerse?.endTime}
            currentVerseStartTime={currentVerse?.startTime}
            onVerseEnd={goToNextVerse}
            playbackSpeed={playbackSpeed}
          />
        </div>
      )}
    </div>
  );
};

export default Quran;
