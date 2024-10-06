import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface User {
  id: string;
  // Добавьте другие необходимые поля пользователя
}

export function createSessionToken(user: User): string {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifySessionToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    // Здесь вы можете добавить логику для получения пользователя из базы данных по userId
    return { id: decoded.userId };
  } catch (error) {
    console.error('Ошибка верификации токена:', error);
    return null;
  }
}