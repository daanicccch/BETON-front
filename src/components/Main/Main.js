import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { MainContainer } from './Main.styles';
import { getUserBalance, startGameSession } from '../../services/userService'; // Импортируем startGameSession

const Main = ({ initDataRaw, language }) => {
  const [balance, setBalance] = useState(null); // Изначально null, чтобы различать состояние загрузки
  const [gameUrl, setGameUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Для отображения состояния загрузки

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await getUserBalance(initDataRaw);
        setBalance(response.balance);
        setIsLoading(false); // Когда баланс получен, снимаем состояние загрузки
      } catch (error) {
        console.error('Ошибка при получении баланса:', error);
        setIsLoading(false); // Даже в случае ошибки снимаем состояние загрузки
      }
    };

    fetchBalance();
  }, [initDataRaw]); // Добавляем initDataRaw как зависимость, чтобы обновлять данные при изменении

  const handleStartGame = async (gameIdentifier) => {
    try {
      const gameUrl = await startGameSession(gameIdentifier, initDataRaw, balance, language);
      setGameUrl(gameUrl);
    } catch (error) {
      console.error('Ошибка при создании игровой сессии:', error);
    }
  };

  return (
    <MainContainer>
      <Header language={language} updateBalance={setBalance} />
      <div>
        {isLoading ? (
          <span>{language === 'ru' ? 'Загрузка баланса...' : 'Loading balance...'}</span>
        ) : (
          <span>{language === 'ru' ? 'Ваш баланс: ' : 'Your balance: '}{balance} USDT</span>
        )}
      </div>
      <button onClick={() => handleStartGame('ScratchAlpacaBronze')}>
        {language === 'ru' ? 'Начать игру Cherry Fiesta' : 'Start Cherry Fiesta'}
      </button>
      {gameUrl && (
        <iframe src={gameUrl} width="100%" height="600px" title="Game"></iframe>
      )}
    </MainContainer>
  );
};

export default Main;
