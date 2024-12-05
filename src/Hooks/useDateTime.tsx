import { useState, useEffect } from 'react';

export const useDateTime = (): [string, string] => {
  const [dateNow, setDateNow] = useState('');
  const [timeNow, setTimeNow] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format date: 'Wednesday 5 December 2024'
      const date = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);

      // Format time: 'HH:mm'
      const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      setDateNow(date);
      setTimeNow(time);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return [dateNow, timeNow];
};
