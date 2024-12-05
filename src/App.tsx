import { useAxios } from "./Hooks";
import { useEffect, useState, useRef } from "react";
import { RANDOM_BG_URL } from "./Urls/index";
import {
  DateTime,
  Quran,
  PrayerTimesTab,
  Settings,
  HijriDate,
  EnglishDate,
  Donate,
  AboutUs,
} from "./Components";
import { ToastContainer } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ResponseType } from "./types";
import { useTranslation } from "react-i18next";
import { SettingsProvider } from "./contexts/SettingsContext";

const fallbackImages = [
  "/tab-backgrounds/bg1.png",
  "/tab-backgrounds/bg2.jpg",
  "/tab-backgrounds/bg3.jpg",
  "/tab-backgrounds/bg4.jpg",
  "/tab-backgrounds/bg5.jpg",
];

function App() {
  const [bgImage, setBgImage] = useState<string>("");
  const [bgAlt, setBgAlt] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [language, setLanguage] = useState("en");
  const { i18n } = useTranslation();
  
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
      }
    };
    handleResponse();
  }, [response]);


  useEffect(() => {
    i18n.changeLanguage(language);
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

  return (
    <SettingsProvider>
      <div className="flex flex-col items-center justify-center font-mono min-h-screen w-screen relative">
        {/* Background Image */}
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

        {/* Main Content */}
        <div className="flex flex-col justify-center items-center z-10 w-full px-4 mt-28">
          <ToastContainer
            position="top-center"
            newestOnTop={true}
            rtl={false}
            pauseOnFocusLoss
          />
          <div className="z-10">
            <HijriDate />
            <EnglishDate />
            <DateTime />
            <Quran />
            <PrayerTimesTab
              volume={volume}
              isSoundEnabled={isSoundEnabled}
              onSoundToggle={() => setIsSoundEnabled((prev) => !prev)}
              onVolumeChange={(vol: any) => setVolume(vol)}
              language={language}
            />
            <Settings
              isSoundEnabled={isSoundEnabled}
              onSoundToggle={() => setIsSoundEnabled((prev) => !prev)}
              onVolumeChange={setVolume}
              volume={volume}
              language={language}
              setLanguage={setLanguage}
            />
            <AboutUs />
          </div>
        </div>

        {/* Footer with Donate Component */}
        <footer className="w-full mt-auto flex items-center justify-center mb-4">
          <Donate />
        </footer>
      </div>
    </SettingsProvider>
  );
}

export default App;
