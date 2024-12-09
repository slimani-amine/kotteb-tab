import React from "react";
import {
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdSkipPrevious,
  MdFavorite,
  MdFavoriteBorder,
  MdTranslate,
  MdInfoOutline,
  MdContentCopy,
} from "react-icons/md";
import { useTranslation } from "react-i18next";

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
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div
      className={`flex justify-center items-center select-none ${
        isRTL ? "space-x-reverse" : "space-x-4"
      }`}
    >
      <MdContentCopy
        onClick={onCopy}
        className={`w-[2rem] h-[2rem] cursor-pointer text-gray-300 hover:bg-gray-700 hover:rounded-md p-1 ${
          isRTL ? "ml-2" : "mr-2"
        }`}
        title={isRTL ? "نسخ" : "Copy"}
      />
      {isFavorite ? (
        <MdFavorite
          onClick={onToggleFavorite}
          className="w-8 h-8 text-red-500 cursor-pointer hover:text-red-600"
          title={isRTL ? "إزالة المفضلة" : "Remove Favorite"}
        />
      ) : (
        <MdFavoriteBorder
          onClick={onToggleFavorite}
          className="w-8 h-8 text-white cursor-pointer hover:text-red-500"
          title={isRTL ? "إضافة المفضلة" : "Add Favorite"}
        />
      )}
      <MdSkipPrevious
        onClick={onPrevious}
        className="w-8 h-8 cursor-pointer hover:text-[#FECA30]"
        title={isRTL ? "السابق" : "Previous"}
      />
      {isPlaying ? (
        <MdPause
          onClick={onPlayPause}
          className="w-10 h-10 cursor-pointer text-[#FECA30]"
          title={isRTL ? "إيقاف" : "Pause"}
        />
      ) : (
        <MdPlayArrow
          onClick={onPlayPause}
          className="w-10 h-10 cursor-pointer text-[#FECA30]"
          title={isRTL ? "تشغيل" : "Play"}
        />
      )}
      <MdSkipNext
        onClick={onNext}
        className="w-8 h-8 cursor-pointer hover:text-[#FECA30]"
        title={isRTL ? "التالي" : "Next"}
      />
      <MdTranslate
        onClick={onOpenTranslation}
        className="w-8 h-8 cursor-pointer hover:text-[#FECA30]"
        title={isRTL ? "الترجمة" : "Translation"}
      />
      <MdInfoOutline
        onClick={onOpenTafseer}
        className="w-8 h-8 cursor-pointer hover:text-[#FECA30]"
        title={isRTL ? "التفسير" : "Tafseer"}
      />
    </div>
  );
};
