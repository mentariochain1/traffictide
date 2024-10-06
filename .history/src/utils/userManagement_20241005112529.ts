import { TelegramUser } from './telegramAuth';

export async function createOrUpdateUser(telegramUser: TelegramUser) {
  // Здесь должна быть логика создания или обновления пользователя в базе данных
  // Временная заглушка:
  return {
    id: telegramUser.id.toString(),
    firstName: telegramUser.first_name,
    lastName: telegramUser.last_name,
    username: telegramUser.username,
  };
}