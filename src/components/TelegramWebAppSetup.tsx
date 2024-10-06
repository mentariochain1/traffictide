'use client';

import { useEffect } from 'react';
import { getTelegramWebApp } from '@/utils/telegramWebApp';

export function TelegramWebAppSetup() {
  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (webApp) {
      webApp.ready();
      // Удалим все вызовы HapticFeedback отсюда
    }
  }, []);

  return null;
}