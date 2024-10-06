import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface User {
  id: string;
  // Добавьте другие необходимые поля пользователя
}

export function createSessionToken(user: User): string {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
}