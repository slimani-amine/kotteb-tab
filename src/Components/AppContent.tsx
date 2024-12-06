import { useAxios } from "../Hooks";
import { useEffect, useState, useRef } from "react";
import { RANDOM_BG_URL } from "../Urls/index";
import {
  DateTime,
  Quran,
  PrayerTimesTab,
  Settings,
  HijriDate,
  EnglishDate,
  Donate,
  AboutUs,
} from "./";
import { ToastContainer } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ResponseType } from "../types";
import { useTranslation } from "react-i18next";
import { useSettings } from "../contexts/SettingsContext";
import { IndexedDBService } from "../services/indexedDB";

const fallbackImages = [
  "/tab-backgrounds/bg1.png",
  "/tab-backgrounds/bg2.jpg",
  "/tab-backgrounds/bg3.jpg",
  "/tab-backgrounds/bg4.jpg",
  "/tab-backgrounds/bg5.jpg",
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

  const [res, error] = useAxios({
    method: "get",
    url: RANDOM_BG_URL,
  });

  const response = res as ResponseType | undefined;

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.data) {
        const fetchedImage = response.data;
        setBgImage(fetchedImage.url);
        setBgAlt(fetchedImage.name);
      } else if (!bgImage) {
        const randomIndex = Math.floor(Math.random() * fallbackImages.length);
        setBgImage(fallbackImages[randomIndex]);
        setBgAlt("Fallback Image");
      }
    };
    handleResponse();
  }, [response, bgImage]);

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
      if (settings.background.blur > 0) {
        bgRef.current.style.filter = `blur(${settings.background.blur}px)`;
      } else {
        bgRef.current.style.filter = "none";
      }
    }
  }, [bgImage, imageLoaded, settings.background.blur]);

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
          IndexedDBService.getRecitationVolume()
        ]);
        
        if (typeof savedAdhanVolume === 'number') {
          setAdhanVolume(savedAdhanVolume);
        }
        if (typeof savedRecitationVolume === 'number') {
          setRecitationVolume(savedRecitationVolume);
        }
      } catch (error) {
        console.error('Error loading volumes:', error);
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
        console.error('Error saving adhan volume:', error);
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
        console.error('Error saving recitation volume:', error);
      }
    };
    saveVolume();
  }, [recitationVolume]);

  return (
    <div
      className={`flex flex-col items-center justify-center font-mono min-h-screen w-screen bg-black  ${
        language === "ar" ? "font-arabic" : ""
      }`}
    >
      {settings.background.show && (
        <div
          ref={bgRef}
          className="absolute top-0 left-0 w-full h-full bg-black/30"
        >
          <LazyLoadImage
            alt={bgAlt}
            height="100%"
            src={bgImage}
            width="100%"
            className="w-full h-full object-cover"
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
            <Quran recitationVolume={recitationVolume} />
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
          <AboutUs />
        </div>
      </div>

      <footer className="w-full mt-auto flex items-center justify-center mb-4 ">
        <Donate />
      </footer>
    </div>
  );
};
