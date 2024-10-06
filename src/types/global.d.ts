import { TelegramWebApps } from '../../telegram';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApps.WebApp;
    };
    TelegramGameProxy?: TelegramWebApps.TelegramGameProxy;
  }
}