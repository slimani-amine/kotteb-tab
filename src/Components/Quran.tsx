import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { useAxios } from "../Hooks";
import { QURAN } from "../Urls";
import { ResponseType } from "../types";
import { QuranData, QuranSurah, QuranVerse, Recitation } from "../types/quran";
import { IndexedDBService } from "../services/indexedDB";
import { QuranModals } from "./Quran/QuranModals";
import { LoadingSpinner } from "./Quran/QuranLoading";
import { QuranDisplay } from "./Quran/QuranDisplay";
import { QuranControls } from "./Quran/QuranControls";
import { QuranAudioPlayer } from "./Quran/QuranAudioPlayer";

interface QuranProps {
  recitationVolume: number;
}

export interface QuranRef {
  navigateToVerse: (surah: number, verse: number) => void;
}

export const Quran = forwardRef<QuranRef, QuranProps>(({ recitationVolume }, ref) => {
  // const [currentReciter, setCurrentReciter] = useState(1);
  const [currentTranslation, setCurrentTranslation] = useState("en");
  // const [recitationMode, setRecitationMode] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState<Array<{ id: string; surah: number; verse: number; text: string }>>([]);
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

  const [res] = useAxios({
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

  const handleToggleFavorite = async () => {
    if (!currentSurah || !currentVerse) return;

    const favoriteItem = {
      id: `${currentSurah.surahId}:${currentVerse.verseId}`,
      surah: currentSurah.surahId,
      verse: currentVerse.verseId,
      text: currentVerse.text,
    };

    try {
      if (isFavorite) {
        await IndexedDBService.removeFavorite(favoriteItem.surah, favoriteItem.verse);
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.id !== favoriteItem.id)
        );
        setIsFavorite(false);
        toast.info("Verse removed from favorites");
      } else {
        await IndexedDBService.saveFavorite(
          favoriteItem.surah,
          favoriteItem.verse,
          favoriteItem.text
        );
        setFavorites((prevFavorites) => [...prevFavorites, favoriteItem]);
        setIsFavorite(true);
        toast.success("Verse added to favorites");
      }
    } catch (error) {
      console.error("Error managing favorites:", error);
      toast.error("Error managing favorites");
    }
  };

  const handleCopyToClipboard = () => {
    if (!currentVerse) return;
    const text = currentVerse.text;
    navigator.clipboard.writeText(text);
    toast.success("Verse copied to clipboard!");
  };

  const handleVerseNavigation = (surah: number, verse: number) => {
    const nextSurah = currentRecitation?.surah.find((s) => s.surahId === surah);
    if (nextSurah) {
      setCurrentSurah(nextSurah);
      const nextVerse = nextSurah.verses.find((v) => v.verseId === verse);
      if (nextVerse) {
        setCurrentVerse(nextVerse);
      }
    }
  };

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favs = await IndexedDBService.getFavorites();
        setFavorites(favs);
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    const checkFavorite = async () => {
      if (currentSurah && currentVerse) {
        try {
          const isFav = await IndexedDBService.isFavorite(
            currentSurah.surahId,
            currentVerse.verseId
          );
          setIsFavorite(isFav);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };
    checkFavorite();
  }, [currentSurah?.surahId, currentVerse?.verseId]);

  useImperativeHandle(ref, () => ({
    navigateToVerse: handleVerseNavigation
  }));

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
      ) : (
        <div className="bg-black bg-opacity-60 rounded-lg p-6 w-[1200px] text-white">
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
            volume={recitationVolume}
          />
        </div>
      )}
    </div>
  );
});

