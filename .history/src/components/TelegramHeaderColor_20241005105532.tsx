'use client';

import { useEffect, useRef } from 'react';
import { getTelegramWebApp } from '../utils/telegramWebApp';

export const TelegramHeaderColor: React.FC = () => {
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (webApp && !isInitializedRef.current) {
      const setHeaderColorSafe = () => {
        webApp.setHeaderColor('#000000');
      };

      setHeaderColorSafe();
      webApp.onEvent('viewportChanged', setHeaderColorSafe);
      isInitializedRef.current = true;

      return () => {
        webApp.offEvent('viewportChanged', setHeaderColorSafe);
      };
    }
  }, []);

  return null;
};