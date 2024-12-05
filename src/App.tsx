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
  const [volume, setVolume] = useState(0.5);
  const [language, setLanguage] = useState("en");
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const [res, loading] = useAxios({
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
    <div className="flex flex-col items-center justify-center font-mono min-h-screen w-screen relative">
      {/* Background Image */}
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

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center z-10 w-full px-4 mt-28">
        <ToastContainer
          position="top-center"
          newestOnTop={true}
          closeOnClick
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
  );
}

