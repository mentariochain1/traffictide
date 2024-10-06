import { NextResponse } from 'next/server';
import { verifyTelegramWebAppData } from '@/utils/telegramAuth';
import { createOrUpdateUser } from '@/utils/userManagement';
import { createSessionToken } from '@/utils/sessionManagement';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { initData } = body;

    // Проверяем данные, предоставленные Telegram
    const telegramUser = verifyTelegramWebAppData(initData);

    if (!telegramUser) {
      return NextResponse.json({ error: 'Недействительные данные Telegram' }, { status: 400 });
    }

    // Создаем или обновляем пользователя в базе данных
    const user = await createOrUpdateUser(telegramUser);

    // Создаем токен сессии для пользователя
    const token = createSessionToken(user);

    // Устанавливаем куки с токеном
    const response = NextResponse.json({ 
      message: 'Вход выполнен успешно',
      user: user
    });

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 дней
    });

    return response;

  } catch (error) {
    console.error('Ошибка входа:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}