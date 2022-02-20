import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { CookiesProvider } from 'react-cookie';

import BondingCurve from 'pages/BondingCurve';
import { darkNew } from 'theme/theme';
import { GlobalStyle } from 'theme/GlobalStyle';
import { AutoLogin } from 'context/AutoLogin';
import ChainProvider from 'context/chain/ChainContext';
import ExchangeProvider from 'context/exchange/ExchangeContext';
import ModalProvider from 'context/modal/ModalContext';
import MainHeader from 'components/MainHeader';
import SelectValidator from 'components/Modals/BridgeStaking/SelectValidator';
import ValidatorNode from 'components/Modals/BridgeStaking/ValidatorNode';
import './assets/font-faces.css';
import BridgeSwapMain from 'components/Modals/components/BridgeSwapMain';

function App() {
  return (
    <CookiesProvider>
      <ThemeProvider theme={darkNew}>
        <AutoLogin>
          <ChainProvider theme={darkNew}>
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
                </Routes>
              </ModalProvider>
            </ExchangeProvider>
          </ChainProvider>
        </AutoLogin>
      </ThemeProvider>
    </CookiesProvider>
  );
}

export default App;
