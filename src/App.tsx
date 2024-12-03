import { useAxios } from "./Hooks";
import { useEffect, useState, useRef } from "react";
import { RANDOM_BG_URL } from "./Urls/index";
import { Loader, DateTime, Quran, PrayerTimesTab, Settings, HijriDate } from "./Components";
import { ToastContainer } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ResponseType } from "./types";
import { useTranslation } from 'react-i18next';
const fallbackImages = [
  "/tab-backgrounds/bg1.png",
  "/tab-backgrounds/bg2.jpg",
  "/tab-backgrounds/bg3.jpeg",
  "/tab-backgrounds/bg4.avif",
  "/tab-backgrounds/bg5.avif",
  "/tab-backgrounds/bg6.avif",
  "/tab-backgrounds/bg7.avif",
  "/tab-backgrounds/bg8.avif",
  "/tab-backgrounds/bg9.avif",
  "/tab-backgrounds/bg10.avif",
  "/tab-backgrounds/bg11.avif",
  "/tab-backgrounds/bg12.avif",
  "/tab-backgrounds/bg13.jpg",
];

export default function App() {
  const [bgImage, setBgImage] = useState("");
  const [bgAlt, setBgAlt] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  // Initialize volume as 0.5 (50%)
  const [volume, setVolume] = useState(0.5);
  const [language, setLanguage] = useState('en');
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set initial language when app loads
    i18n.changeLanguage(language);
  }, [language]);

  const [res, loading, error] = useAxios({
    method: "get",
    url: RANDOM_BG_URL,
  });

  const response = res as ResponseType | undefined;

  useEffect(() => {
    const fetchedImage = response?.data;

    if (fetchedImage?.url && !bgImage) {
      setBgImage(fetchedImage.url);
      setBgAlt(fetchedImage.name);
    } else if (!fetchedImage?.url && !bgImage) {
      // Select a random fallback image if no fetched image is available
      const randomIndex = Math.floor(Math.random() * fallbackImages.length);
      setBgImage(fallbackImages[randomIndex]);
      setBgAlt("Fallback Image");
    }
  }, [response, bgImage]);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setImageLoaded(true);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "0px 0px 200px 0px",
    });

    if (bgRef.current) {
      observer.observe(bgRef.current);
    }

    return () => {
      if (bgRef.current) {
        observer.unobserve(bgRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center font-mono h-full w-screen relative ">
      <div
        ref={bgRef}
        className="absolute top-0 left-0 w-full h-full bg-black/30"
        style={{
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        <LazyLoadImage
          src={imageLoaded ? bgImage : "https://via.placeholder.com/150"}
          alt={bgAlt}
          className="w-full h-full object-cover blur-[2px]"
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>

      {loading && <Loader />}
      <div className="flex flex-col z-10">
        <ToastContainer
          position="top-center"
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss
        />
        <div className=" z-10 ">
          <HijriDate />
          <DateTime />
          <Quran />
          <PrayerTimesTab 
            volume={volume} 
            isSoundEnabled={isSoundEnabled} 
            onSoundToggle={() => setIsSoundEnabled(prev => !prev)}
            onVolumeChange={(vol) => setVolume(vol)}
            language={language}
          />
          <Settings
            isSoundEnabled={isSoundEnabled}
            onSoundToggle={() => setIsSoundEnabled(prev => !prev)}
            onVolumeChange={setVolume}
            volume={volume}
            language={language}
            setLanguage={setLanguage}
          />
        </div>
      </div>
    </div>
  );
}
