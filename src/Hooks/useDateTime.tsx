import { useState, useEffect } from 'react';

export const useDateTime = (): [string, string] => {
  const [dateNow, setDateNow] = useState('');
  const [timeNow, setTimeNow] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const date = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);

      const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      setDateNow(date);
      setTimeNow(time);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); 
    return () => clearInterval(interval);
  }, []);

  return [dateNow, timeNow];
};
