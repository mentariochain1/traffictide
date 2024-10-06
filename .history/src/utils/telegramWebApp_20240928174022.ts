type TelegramWebApp = {
  setHeaderColor: (color: string) => void;
  ready: () => void;
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  onEvent: (eventType: string, callback: () => void) => void;
  MainButton: {
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  version: string;
  sendData: (data: string) => void;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };
  };
};

interface ExtendedWindow extends Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}

export function isTelegramWebAppAvailable(): boolean {
  return typeof window !== 'undefined' && 'Telegram' in window && 'WebApp' in ((window as ExtendedWindow).Telegram || {});
}

export function getTelegramWebApp() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
}

export const triggerHapticFeedback = (type: 'impact' | 'notification' | 'selection', style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
  const webApp = getTelegramWebApp();
  
  if (webApp?.HapticFeedback) {
    switch (type) {
      case 'impact':
        webApp.HapticFeedback.impactOccurred(style || 'medium');
        break;
      case 'notification':
        webApp.HapticFeedback.notificationOccurred('success');
        break;
      case 'selection':
        webApp.HapticFeedback.selectionChanged();
        break;
    }
  }
};

// Добавим функцию для отладки
export const debugHapticFeedback = () => {
  console.log('Haptic feedback triggered');
};

// Удалим дублирующуюся функцию isTelegramWebAppAvailable