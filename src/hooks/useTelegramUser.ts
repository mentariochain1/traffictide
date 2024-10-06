import { useState, useEffect } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export const useTelegramUser = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const checkTelegramWebApp = () => {
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
        console.log('Telegram user data:', telegramUser);
        setUser(telegramUser);
        return true;
      }
      return false;
    };

    if (checkTelegramWebApp()) return;

    const intervalId = setInterval(checkTelegramWebApp, 100);

    return () => clearInterval(intervalId);
  }, []);

  return { user };
};