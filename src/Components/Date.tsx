import React, { useEffect, useState } from "react";
import { useDateTime } from "../Hooks";

export const EnglishDate: React.FC = () => {
  const [dateNow, timeNow] = useDateTime();
  const [arabicDate, setArabicDate] = useState("");

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      calendar: "islamic",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const hijriDate = new Intl.DateTimeFormat("ar-SA", options).format(date);
    setArabicDate(hijriDate);
  }, []);
  return (
    <div className="absolute top-4 w-full flex justify-between text-white px-2 z-50">
      <p className="text-xl font-semibold" dir="rtl">
        {dateNow}
      </p>
      <p className="text-xl font-semibold" dir="rtl">
        {arabicDate}
      </p>
    </div>
  );
};
