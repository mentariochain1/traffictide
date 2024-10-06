'use client';

import { useEffect } from 'react';

export function ErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
      // Здесь вы можете добавить дополнительную логику обработки ошибок
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}