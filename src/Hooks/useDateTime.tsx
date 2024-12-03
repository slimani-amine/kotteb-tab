import { useState, useEffect } from 'react';

export const useDateTime = (): [string, string] => {
  const [dateNow, setDateNow] = useState('');
  const [timeNow, setTimeNow] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString(); // Format date as per locale
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); // Format time as HH:mm
      setDateNow(date);
      setTimeNow(time);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return [dateNow, timeNow];
};
