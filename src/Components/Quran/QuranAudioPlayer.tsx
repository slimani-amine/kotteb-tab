import React, { useEffect, useRef } from 'react';

interface QuranAudioPlayerProps {
  audioUrl?: string;
  isPlaying: boolean;
  onEnded: () => void;
  currentVerseEndTime?: string;
  currentVerseStartTime?: string;
  onVerseEnd: () => void;
  playbackSpeed: number;
  volume: number;
}

export const QuranAudioPlayer: React.FC<QuranAudioPlayerProps> = ({
  audioUrl,
  isPlaying,
  onEnded,
  currentVerseEndTime,
  currentVerseStartTime,
  onVerseEnd,
  playbackSpeed,
  volume,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      if (currentVerseStartTime) {
        audioRef.current.currentTime = timeToSeconds(currentVerseStartTime);
      }
    }
  }, [audioUrl, currentVerseStartTime]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const timeToSeconds = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(parseFloat);
    return hours * 3600 + minutes * 60 + seconds;
  };

  return (
    <div className="quran-audio-player">
      <audio
        ref={audioRef}
        onEnded={onEnded}
        onTimeUpdate={() => {
          if (
            audioRef.current &&
            currentVerseEndTime &&
            timeToSeconds(currentVerseEndTime) <= audioRef.current.currentTime
          ) {
            onVerseEnd();
          }
        }}
      />
    </div>
  );
};
