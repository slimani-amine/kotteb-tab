import React from "react";
import {
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdSkipPrevious,
  MdFavorite,
  MdFavoriteBorder,
  MdSettings,
  MdTranslate,
  MdInfoOutline,
  MdContentCopy,
} from "react-icons/md";

interface QuranControlsProps {
  isPlaying: boolean;
  isFavorite: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onCopy: () => void;
  onPrevious: () => void;
  onToggleFavorite: () => void;
  onOpenSettings: () => void;
  onOpenTranslation: () => void;
  onOpenTafseer: () => void;
}

export const QuranControls: React.FC<QuranControlsProps> = ({
  isPlaying,
  isFavorite,
  onPlayPause,
  onNext,
  onCopy,
  onPrevious,
  onToggleFavorite,
  onOpenSettings,
  onOpenTranslation,
  onOpenTafseer,
}) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      <MdContentCopy
        onClick={onCopy}
        className="w-[2rem] h-[2rem] cursor-pointer text-gray-300 hover:bg-gray-700 hover:rounded-md p-1 mr-2"
      />
      {isFavorite ? (
        <MdFavorite
          onClick={onToggleFavorite}
          className="w-8 h-8 text-red-500 cursor-pointer hover:text-red-600"
        />
      ) : (
        <MdFavoriteBorder
          onClick={onToggleFavorite}
          className="w-8 h-8 text-white cursor-pointer hover:text-red-500"
        />
      )}
      <MdSkipPrevious
        onClick={onPrevious}
        className="w-8 h-8 cursor-pointer hover:text-yellow-500"
      />
      {isPlaying ? (
        <MdPause
          onClick={onPlayPause}
          className="w-10 h-10 cursor-pointer text-yellow-500"
        />
      ) : (
        <MdPlayArrow
          onClick={onPlayPause}
          className="w-10 h-10 cursor-pointer text-yellow-500"
        />
      )}
      <MdSkipNext
        onClick={onNext}
        className="w-8 h-8 cursor-pointer hover:text-yellow-500"
      />
      <MdTranslate
        onClick={onOpenTranslation}
        className="w-8 h-8 cursor-pointer hover:text-yellow-500"
      />
      <MdInfoOutline
        onClick={onOpenTafseer}
        className="w-8 h-8 cursor-pointer hover:text-yellow-500"
      />
    </div>
  );
};
