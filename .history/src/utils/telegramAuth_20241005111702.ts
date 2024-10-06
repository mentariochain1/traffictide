import crypto from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN; // Токен вашего бота

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export function verifyTelegramWebAppData(initData: string): TelegramUser | null {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  urlParams.sort();

  let dataCheckString = '';
  Array.from(urlParams.entries()).forEach(([key, value]) => {
    dataCheckString += `${key}=${value}\n`;
  });
  dataCheckString = dataCheckString.slice(0, -1);

  const secret = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  const calculatedHash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  if (calculatedHash !== hash) {
    return null;
  }

  const user = JSON.parse(urlParams.get('user') || '{}');
  return user as TelegramUser;
}