import { NextResponse } from 'next/server';
import { verifyTelegramWebAppData } from '../../../utils/telegramAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { initData } = body;

    // Проверяем данные, предоставленные Telegram
    const telegramUser = verifyTelegramWebAppData(initData);

    if (!telegramUser) {
      return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 400 });
    }

    // Здесь вы бы создали или обновили пользователя в вашей базе данных
    // Например:
    // const user = await createOrUpdateUser(telegramUser);

    // Создаем сессию для пользователя
    // Это может быть JWT токен или другой механизм сессий
    // const token = createSessionToken(user);

    return NextResponse.json({ 
      message: 'Login successful',
      user: telegramUser,
      // token: token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}