import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500"></div>
  </div>
);

export const ErrorMessage: React.FC = () => (
  <div className="text-red-500 text-center p-4">
    Error loading Quran data. Please try again later.
  </div>
);
