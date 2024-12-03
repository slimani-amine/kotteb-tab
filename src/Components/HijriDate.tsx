import React, { useState, useEffect } from 'react';

export const HijriDate: React.FC = () => {
  const [arabicDate, setArabicDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      calendar: 'islamic',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const hijriDate = new Intl.DateTimeFormat('ar-SA', options).format(date);
    setArabicDate(hijriDate);
  }, []);

  return (
    <div className="absolute top-4 right-4  text-white">
      <p className="text-lg font-arabic" dir="rtl">{arabicDate}</p>
    </div>
  );
};
