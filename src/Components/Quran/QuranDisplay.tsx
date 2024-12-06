import React from 'react';

interface QuranDisplayProps {
  basmalah: string;
  surahId?: number;
  verseText?: string;
  verseId?: number;
}

export const QuranDisplay: React.FC<QuranDisplayProps> = ({
  basmalah,
  surahId,
  verseText,
  verseId,
}) => {
  return (
    <div className="text-center flex flex-col gap-12 ">
      {(surahId !== 1 || verseId !== 1) && (
        <p className="text-[#FECA30] text-[1.8rem] font-QuranFont">
          {basmalah}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-4">
          <p className="text-white text-[2.5rem] font-QuranFont">
            {verseText}
          </p>
        </div>

        <p className="text-lg">
          ({surahId}:{verseId})
        </p>
      </div>
    </div>
  );
};
