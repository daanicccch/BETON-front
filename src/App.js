import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Main from './components/Main/Main';
import Wallet from './components/wallet/wallet';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const AppContainer = styled.div`
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  overflow-x: hidden;
`;

const AppContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const AppContentWithRouter = () => {
  const [initDataRaw, setInitDataRaw] = useState(''); // Сохраняем initDataRaw

  useEffect(() => {
    window.Telegram.WebApp.expand(); // Расширяем Web App
  
    // Получаем initData напрямую через Telegram WebApp API
    const initDataRaw = window.Telegram.WebApp.initData;
    const initData = window.Telegram.WebApp.initDataUnsafe;
  
    // Проверяем, есть ли chat_instance и chat_type
    console.log('initDataRaw:', initDataRaw);
    console.log('Полные данные на фронте:', {
      user: initData.user,
      chat_instance: initData.chat_instance, // Проверяем наличие chat_instance
      chat_type: initData.chat_type,         // Проверяем наличие chat_type
      auth_date: initData.auth_date,
      hash: initData.hash,
    });
  
    setInitDataRaw(initDataRaw); // Сохраняем initDataRaw
  }, []);
  

  return (
      <AppContainer>
        <AppContent>
          <Routes>
            <Route path="/" element={<Main initDataRaw={initDataRaw} />} />
            <Route path="/wallet" element={<Wallet initDataRaw={initDataRaw} />} />
          </Routes>
        </AppContent>
      </AppContainer>
  );
};

const App = () => (
  <TonConnectUIProvider 
    manifestUrl="https://raw.githubusercontent.com/daanicccch/tonconnect-manifestBcasino.json/main/tonconnect-manifest.json"
    enableAndroidBackHandler={false} // Отключаем обработчик кнопки "назад" на Android
  >
    <Router>
      <AppContentWithRouter />
    </Router>
  </TonConnectUIProvider>
);


export default App;
