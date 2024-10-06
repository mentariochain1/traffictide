import crypto from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN; // Токен вашего бота

export function verifyTelegramWebAppData(initData: string): any {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  urlParams.sort();

  let dataCheckString = '';
  for (const [key, value] of urlParams.entries()) {
    dataCheckString += `${key}=${value}\n`;
  }
  dataCheckString = dataCheckString.slice(0, -1);

  const secret = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  const calculatedHash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  if (calculatedHash !== hash) {
    return null;
  }

  const user = JSON.parse(urlParams.get('user') || '{}');
  return user;
}