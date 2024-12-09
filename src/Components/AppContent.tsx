import { useAxios } from "../Hooks";
import { useEffect, useState, useRef } from "react";
import { RANDOM_BG_URL } from "../Urls/index";
import {
  DateTime,
  Quran,
  PrayerTimesTab,
  Settings,
  EnglishDate,
  Donate,
  Favorites,
} from "./";
import { ToastContainer } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ResponseType } from "../types";
import { useTranslation } from "react-i18next";
import { useSettings } from "../contexts/SettingsContext";
import { IndexedDBService } from "../services/indexedDB";

const fallbackImages = [
  "/tab-backgrounds/bg1.jpg",
  "/tab-backgrounds/bg2.jpg",
  "/tab-backgrounds/bg3.jpg",
  "/tab-backgrounds/bg4.jpg",
  "/tab-backgrounds/bg5.jpg",
  "/tab-backgrounds/bg6.jpg",
  "/tab-backgrounds/bg7.jpg",
  "/tab-backgrounds/bg8.jpg",
  "/tab-backgrounds/bg9.jpg",
  "/tab-backgrounds/bg10.jpg",
  "/tab-backgrounds/bg11.jpg",
  "/tab-backgrounds/bg12.jpg",
  "/tab-backgrounds/bg13.jpg",
  "/tab-backgrounds/bg14.jpg",
  "/tab-backgrounds/bg15.jpg",
  "/tab-backgrounds/bg16.jpg",
  "/tab-backgrounds/bg17.jpg",
  "/tab-backgrounds/bg18.jpg",
];

export const AppContent = () => {
  const [bgImage, setBgImage] = useState<string>("");
  const [bgAlt, setBgAlt] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [adhanVolume, setAdhanVolume] = useState(0.5);
  const [recitationVolume, setRecitationVolume] = useState(0.5);
  const [language, setLanguage] = useState("en");
  const { i18n } = useTranslation();
  const { settings } = useSettings();

  const [res, loading, error] = useAxios({
    method: "get",
    url: RANDOM_BG_URL,
  });

  const response = res as ResponseType | undefined;

  useEffect(() => {
    const handleResponse = async () => {
      if (!settings.background.show) {
        setBgImage("");
        setBgAlt("");
        return;
      }

      if (
        settings.background.source === "custom" &&
        settings.background.customImageUrl
      ) {
        setBgImage(settings.background.customImageUrl);
        setBgAlt("Custom Background");
        return;
      }

      if (response?.data) {
        const fetchedImage = response.data;
        setBgImage(fetchedImage.url);
        setBgAlt(fetchedImage.name);
      } else if (error) {
        const randomIndex = Math.floor(Math.random() * fallbackImages.length);
        setBgImage(fallbackImages[randomIndex]);
        setBgAlt("Fallback Image");
      }
    };
    handleResponse();
  }, [response, bgImage, settings.background]);

  useEffect(() => {
    i18n.changeLanguage(language);
    // Update document direction based on language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    // Add RTL class to body for Tailwind RTL support
    if (language === "ar") {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
  }, [language, i18n]);

  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.style.backgroundImage = `url(${bgImage})`;
      bgRef.current.style.backgroundSize = "cover";
      bgRef.current.style.backgroundPosition = "center";
    }
  }, [bgImage, imageLoaded]);

  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src = bgImage;
    preloadImage.onload = () => {
      setImageLoaded(true);
    };
  }, [bgImage]);

  // Load volumes from IndexedDB
  useEffect(() => {
    const loadVolumes = async () => {
      try {
        const [savedAdhanVolume, savedRecitationVolume] = await Promise.all([
          IndexedDBService.getAdhanVolume(),
          IndexedDBService.getRecitationVolume(),
        ]);

        if (typeof savedAdhanVolume === "number") {
          setAdhanVolume(savedAdhanVolume);
        }
        if (typeof savedRecitationVolume === "number") {
          setRecitationVolume(savedRecitationVolume);
        }
      } catch (error) {
        console.error("Error loading volumes:", error);
      }
    };
    loadVolumes();
  }, []);

  // Save adhan volume to IndexedDB when it changes
  useEffect(() => {
    const saveVolume = async () => {
      try {
        await IndexedDBService.saveAdhanVolume(adhanVolume);
      } catch (error) {
        console.error("Error saving adhan volume:", error);
      }
    };
    saveVolume();
  }, [adhanVolume]);

  // Save recitation volume to IndexedDB when it changes
  useEffect(() => {
    const saveVolume = async () => {
      try {
        await IndexedDBService.saveRecitationVolume(recitationVolume);
      } catch (error) {
        console.error("Error saving recitation volume:", error);
      }
    };
    saveVolume();
  }, [recitationVolume]);

  const quranRef = useRef(null);

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        backgroundColor: !settings.background.show
          ? settings.background.backgroundColor
          : "#404040",
        
      }}
    >
      {settings.background.show && bgImage && (
        <div
          ref={bgRef}
          className="fixed inset-0 w-full h-full transition-opacity duration-1000"
          style={{
            opacity: imageLoaded ? 1 : 0,
            filter: `blur(${settings.background.blur}px)`,
          }}
        >
          <LazyLoadImage
            alt={bgAlt}
            height="100%"
            src={bgImage}
            width="100%"
            className="w-full h-full object-cover opacity-70"
            onLoad={() => {
              setImageLoaded(true);
            }}
          />
        </div>
      )}
      {settings.general.showDateTime && (
        <>
          <EnglishDate />
        </>
      )}
      <div
        className={`flex flex-col justify-center items-center z-10 w-full px-4 mt-20 ${
          language === "ar" ? "text-right" : "text-left"
        }`}
      >
        <ToastContainer
          position="top-center"
          newestOnTop={true}
          rtl={language === "ar"}
          pauseOnFocusLoss
        />
        <div className="z-10">
          {settings.general.showDateTime && (
            <>
              <DateTime />
            </>
          )}
          {settings.general.showQuran && (
            <Quran ref={quranRef} recitationVolume={recitationVolume} />
          )}
          {settings.general.showPrayerTimes && (
            <PrayerTimesTab
              volume={adhanVolume}
              isSoundEnabled={isSoundEnabled}
              onSoundToggle={() => setIsSoundEnabled((prev) => !prev)}
              language={language}
            />
          )}
          <Settings
            onVolumeChange={(vol: any) => setAdhanVolume(vol)}
            volume={adhanVolume}
            language={language}
            setLanguage={setLanguage}
            onRecitationVolumeChange={(vol: any) => setRecitationVolume(vol)}
            recitationVolume={recitationVolume}
          />
          <Favorites quranRef={quranRef} />
        </div>
      </div>

      <footer className="w-full mt-auto flex items-center justify-center mb-4 ">
        <Donate />
      </footer>
    </div>
  );
};
