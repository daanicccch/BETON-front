import axios from 'axios'; 

const serverUrl = 'http://localhost:5173';

// Функция для извлечения chatId из initData
const extractChatIdFromInitData = (initData) => {
  const params = new URLSearchParams(initData);
  const userJsonString = params.get('user');
  const user = JSON.parse(userJsonString); // Преобразуем строку 'user' в объект
  return user.id; // Возвращаем chatId
};

// Получаем пользователя по chatId
const getUserByChatId = async (initData) => {
  const chatId = extractChatIdFromInitData(initData); // Извлекаем chatId

  const response = await fetch(`${serverUrl}/api/users/${chatId}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${initData}` // Передаем строку initData
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};

// Получаем язык пользователя
const getUserLanguage = async (initData) => {
  const chatId = extractChatIdFromInitData(initData); // Извлекаем chatId

  const response = await fetch(`${serverUrl}/api/users/language/${chatId}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${initData}` // Передаем строку initData
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.languageCode;
};

// Получаем баланс пользователя
const getUserBalance = async (initData) => {
  const chatId = extractChatIdFromInitData(initData); // Извлекаем chatId

  const response = await fetch(`${serverUrl}/api/users/balance/${chatId}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${initData}` // Передаем строку initData
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};

// Обновляем баланс пользователя
const updateUserBalance = async (initData, amount) => {
  const chatId = extractChatIdFromInitData(initData); // Извлекаем chatId
  console.log(`Отправка запроса на обновление баланса: chatId = ${chatId}, amount = ${amount}`);
  
  const response = await fetch(`${serverUrl}/api/users/update-balance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${initData}` // Передаем строку initData
    },
    body: JSON.stringify({ chatId, amount }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};

// Начало игровой сессии
const startGameSession = async (gameIdentifier, initData, balance, language) => {
  const chatId = extractChatIdFromInitData(initData); // Извлекаем chatId

  try {
    // Отправляем запрос на сервер для создания игровой сессии
    const response = await fetch(`${serverUrl}/api/games/start-game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${initData}`, // Передаем строку initData для авторизации
      },
      body: JSON.stringify({
        gameIdentifier,
        userId: chatId,
        balance, // Передаем баланс напрямую
        language
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    // Возвращаем URL игры для загрузки
    return data.gameUrl;
  } catch (error) {
    console.error('Ошибка при создании игровой сессии:', error);
    throw new Error('Не удалось начать игровую сессию');
  }
};

export { 
  getUserByChatId, 
  getUserLanguage, 
  getUserBalance, 
  updateUserBalance, 
  startGameSession
};
