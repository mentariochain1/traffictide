type TelegramWebApp = {
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  setHeaderColor: (color: string) => void;
  onEvent: (eventType: string, eventHandler: () => void) => void;
  offEvent: (eventType: string, eventHandler: () => void) => void;
};

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp as TelegramWebApp;
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