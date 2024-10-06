export function setupTelegramGameProxyPolyfill() {
  if (typeof window !== 'undefined' && !window.TelegramGameProxy) {
    const dummyReceiveEvent = (eventName: string, eventData: unknown) => {
      console.warn(`TelegramGameProxy.receiveEvent called with:`, eventName, eventData);
    };

    Object.defineProperty(window, 'TelegramGameProxy', {
      value: {
        receiveEvent: dummyReceiveEvent
      },
      writable: false,
      configurable: true
    });

    console.warn('TelegramGameProxy polyfill has been set up');
  }
  
  // Удалим эту часть, чтобы не создавать фейковый объект Telegram.WebApp
  /*
  if (typeof window !== 'undefined' && !window.Telegram) {
    window.Telegram = {
      WebApp: {
        ready: () => {},
        onEvent: () => {},
        offEvent: () => {},
        initDataUnsafe: {
          user: {
            id: 12345,
            first_name: 'John',
            last_name: 'Doe',
            username: 'johndoe'
          }
        }
      }
    };
  }
  */
}