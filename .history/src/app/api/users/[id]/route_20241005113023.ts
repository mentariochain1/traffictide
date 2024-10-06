import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/utils/sessionManagement';
import { getUserById } from '@/utils/userManagement';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Получаем токен из куки
    const authToken = request.headers.get('Cookie')?.split('; ')
      .find(row => row.startsWith('authToken='))
      ?.split('=')[1];

    if (!authToken) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    // Проверяем токен
    const decodedToken = verifySessionToken(authToken);

    if (!decodedToken) {
      return NextResponse.json({ error: 'Недействительный токен' }, { status: 401 });
    }

    // Получаем информацию о запрашиваемом пользователе
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    // Проверяем, имеет ли текущий пользователь право на просмотр информации
    // Например, только администратор может видеть информацию о других пользователях
    if (decodedToken.userId !== userId /* && !isAdmin(decodedToken.userId) */) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    // Возвращаем информацию о пользователе
    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      // Добавьте другие поля, которые вы хотите вернуть
    });

  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
