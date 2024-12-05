import React from 'react';
import { useDateTime } from '../Hooks';

export const EnglishDate: React.FC = () => {
  const [dateNow, timeNow] = useDateTime();

  return (
    <div className="absolute top-4 left-4  text-white">
      <p className="text-xl font-semibold" dir="rtl">{dateNow}</p>
    </div>
  );
};
