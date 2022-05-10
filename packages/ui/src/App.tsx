import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { CookiesProvider } from 'react-cookie';

import BondingCurve from 'pages/BondingCurve';
import { darkNew } from 'theme/theme';
import { GlobalStyle } from 'theme/GlobalStyle';
import ChainProvider from 'context/chain/ChainContext';
import ExchangeProvider from 'context/exchange/ExchangeContext';
import ModalProvider from 'context/modal/ModalContext';
import MainHeader from 'components/MainHeader';
import SelectValidator from 'components/Modals/BridgeStaking/SelectValidator';
import ValidatorNode from 'components/Modals/BridgeStaking/ValidatorNode';
import BridgeSwapMain from 'components/Modals/components/BridgeSwapMain';
import BridgeInitial from 'components/Modals/components/BridgeInitial';
import BridgeWallets from 'components/Modals/BridgeStaking/BridgeWallets';
import BridgeConnectOnomy from 'components/Modals/BridgeStaking/BridgeConnectOnomy';
import BridgeWelcome from 'components/Modals/BridgeStaking/BridgeWelcome';
import './assets/font-faces.css';

function App() {
  return (
    <CookiesProvider>
      <ThemeProvider theme={darkNew}>
        <ChainProvider>
          <ExchangeProvider>
            <ModalProvider>
              <GlobalStyle />
              <MainHeader />
              <BondingCurve />
              <Routes>
                <Route path="/" element={<></>} />
                <Route path="/validators/" element={<SelectValidator />} />
                <Route path="/validators/:id/*" element={<ValidatorNode />} />
                <Route path="/bridge" element={<BridgeSwapMain />} />
                <Route path="/bridge-initial" element={<BridgeInitial />} />
                <Route path="/bridge-wallets" element={<BridgeWallets />} />
                <Route path="/bridge-connect-onomy" element={<BridgeConnectOnomy />} />
                <Route path="/bridge-welcome" element={<BridgeWelcome />} />
              </Routes>
            </ModalProvider>
          </ExchangeProvider>
        </ChainProvider>
      </ThemeProvider>
    </CookiesProvider>
  );
}

export default App;
