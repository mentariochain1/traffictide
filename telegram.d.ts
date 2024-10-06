declare namespace TelegramWebApps {
  interface WebApp {
    initData: string;
    initDataUnsafe: {
      query_id: string;
      user?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
        language_code?: string;
      };
      auth_date: number;
      hash: string;
    };
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: {
      bg_color: string;
      text_color: string;
      hint_color: string;
      link_color: string;
      button_color: string;
      button_text_color: string;
    };
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    setHeaderColor: (color: string) => void;
    // Добавьте другие методы и свойства по мере необходимости
  }

  interface TelegramGameProxy {
    receiveEvent: (eventName: string, eventData: unknown) => void;
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApps.WebApp;
    };
    TelegramGameProxy?: TelegramWebApps.TelegramGameProxy;
  }
}