import React, { useState, useEffect } from "react";
import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from "adhan";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { tSafe } from "../translations/i18nHelper";

interface PrayerTimesTabProps {
  volume: number;
  isSoundEnabled: boolean;
  language?: string;
  onVolumeChange?: (volume: number) => void;
  onSoundToggle: () => void;
}

// Function to calculate the remaining time until the next prayer
const calculateTimeLeft = (prayerTime: Date) => {
  const currentTime = new Date();
  let diff = prayerTime.getTime() - currentTime.getTime();

  // If the prayer time has passed, add 24 hours to get time until next occurrence
  if (diff < 0) {
    const nextDay = new Date(prayerTime);
    nextDay.setDate(nextDay.getDate() + 1);
    diff = nextDay.getTime() - currentTime.getTime();
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  // Format the time string
  const timeStr =
    hours > 0
      ? `${hours < 10 ? "0" + hours : hours}:${
          minutes < 10 ? "0" + minutes : minutes
        }`
      : `${minutes} min`;

  return {
    time: timeStr,
    diffInMinutes: Math.max(0, diff / (1000 * 60)), // Ensure non-negative
  };
};

export const PrayerTimesTab: React.FC<PrayerTimesTabProps> = ({
  volume,
  isSoundEnabled,
  language = "en",
  onVolumeChange,
  onSoundToggle,
}) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [remainingTimeInMinutes, setRemainingTimeInMinutes] = useState(0);
  const [totalTimeForNextPrayerInMinutes, setTotalTimeForNextPrayerInMinutes] =
    useState(0);

  // Add a ref to handle the adhan sound
  const adhanAudio = new Audio("/adhan.mp3");

  useEffect(() => {
    if (onVolumeChange) {
      adhanAudio.volume = volume;
    }
  }, [volume, onVolumeChange, adhanAudio]);

  useEffect(() => {
    const getUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newCoordinates = new Coordinates(latitude, longitude);
            setCoordinates(newCoordinates);
          },
          (error) => {
            console.error("Error getting location", error);
            setCoordinates(new Coordinates(35.7897507, -78.6912485)); // Default location
          }
        );
      } else {
        setCoordinates(new Coordinates(35.7897507, -78.6912485)); // Default location
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (coordinates) {
      const params = CalculationMethod.MoonsightingCommittee();
      const times = new PrayerTimes(coordinates, currentTime, params);

      setPrayerTimes(times);

      const prayers = [
        { time: times.fajr, name: Prayer.Fajr },
        { time: times.sunrise, name: Prayer.Sunrise },
        { time: times.dhuhr, name: Prayer.Dhuhr },
        { time: times.asr, name: Prayer.Asr },
        { time: times.maghrib, name: Prayer.Maghrib },
        { time: times.isha, name: Prayer.Isha },
      ];

      const nextPrayerObj = prayers.find((prayer) => prayer.time > currentTime);

      if (nextPrayerObj) {
        setNextPrayer(nextPrayerObj.name);
        const { time, diffInMinutes } = calculateTimeLeft(nextPrayerObj.time);
        setTimeLeft(time);
        setRemainingTimeInMinutes(diffInMinutes);

        // Find the previous prayer time to calculate total interval
        const currentPrayerIndex = prayers.indexOf(nextPrayerObj);
        const previousPrayer =
          currentPrayerIndex > 0
            ? prayers[currentPrayerIndex - 1]
            : prayers[prayers.length - 1];

        // Calculate total interval between prayers
        const totalInterval =
          (nextPrayerObj.time.getTime() - previousPrayer.time.getTime()) /
          (1000 * 60);
        setTotalTimeForNextPrayerInMinutes(totalInterval);
      } else {
        // Handle case when next prayer is Fajr of next day
        setNextPrayer(Prayer.Fajr);
        const { time, diffInMinutes } = calculateTimeLeft(times.fajr);
        setTimeLeft(time);
        setRemainingTimeInMinutes(diffInMinutes);

        // Calculate interval between Isha and Fajr
        const totalInterval =
          (new Date(times.fajr.getTime() + 24 * 60 * 60 * 1000).getTime() -
            times.isha.getTime()) /
          (1000 * 60);
        setTotalTimeForNextPrayerInMinutes(totalInterval);
      }

      // Check if the current time matches the prayer time and play the adhan
      prayers.forEach((prayer) => {
        if (
          Math.abs(prayer.time.getTime() - currentTime.getTime()) < 10000 &&
          isSoundEnabled // 10 seconds margin
        ) {
          adhanAudio.play();
        }
      });
    }
  }, [coordinates, currentTime, isSoundEnabled]);

  if (!prayerTimes || !coordinates) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center h-screen"
      >
        {tSafe("loadingPrayerTimes")}
      </motion.div>
    );
  }

  const prayerTimesData = [
    {
      name: "Fajr",
      time: prayerTimes.fajr.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      name: "Sunrise",
      time: prayerTimes.sunrise.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      name: "Dhuhr",
      time: prayerTimes.dhuhr.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      name: "Asr",
      time: prayerTimes.asr.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      name: "Maghrib",
      time: prayerTimes.maghrib.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      name: "Isha",
      time: prayerTimes.isha.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ];

  // Calculate progress bar percentage for the next prayer
  const progress =
    totalTimeForNextPrayerInMinutes > 0
      ? Math.min(
          100,
          Math.max(
            0,
            ((totalTimeForNextPrayerInMinutes - remainingTimeInMinutes) /
              totalTimeForNextPrayerInMinutes) *
              100
          )
        )
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex justify-center p-6 m-0"
    >
      <div className="bg-black bg-opacity-60 text-gray-900 rounded-lg p-6 w-[1100px] shadow-lg flex justify-between items-center text-center relative">
        <a href="https://kotteb.com/" target="_blank">
          <Logo className="cursor-pointer" />
        </a>
        {prayerTimesData.map((prayer) => {
          const isNextPrayer =
            nextPrayer === Prayer[prayer.name as keyof typeof Prayer];

          return (
            <motion.div
              key={prayer.name}
              className="relative flex flex-col items-center justify-center text-center gap-1 text-white group cursor-pointer"
            >
              <motion.p
                className={`text-xl text-white ${
                  isNextPrayer ? "group-hover:opacity-0 text-yellow-300" : ""
                }`}
              >
                {tSafe(prayer.name.toLowerCase())}
              </motion.p>
              <p
                className={`text-2xl text-white ${
                  isNextPrayer ? "group-hover:opacity-0 text-yellow-300" : ""
                }`}
              >
                {prayer.time}
              </p>

              {isNextPrayer && (
                <motion.div
                  className="absolute top-0 flex flex-col items-center justify-center text-center gap-1 cursor-pointer text-yellow-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <p className={`text-xl `}>{tSafe("remainingTime")}</p>
                  <p className={`text-2xl `}>{timeLeft}</p>
                  <div className="opacity-0">
                    <div
                      className="bg-yellow-300 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </motion.div>
              )}
              <div
                className={`w-full bg-gray-300 h-2 rounded-full mt-2 ${
                  isNextPrayer ? "" : "opacity-0"
                }`}
              >
                <div
                  className="bg-yellow-300 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <button
        className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white p-4 rounded-full"
        onClick={onSoundToggle}
      >
        {isSoundEnabled ? (
          <IoVolumeHighOutline className="h-8 w-8" />
        ) : (
          <IoVolumeMuteOutline className="h-8 w-8" />
        )}
      </button>
    </motion.div>
  );
};

export default PrayerTimesTab;
