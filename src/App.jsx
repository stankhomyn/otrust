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
import BridgeSuccess from 'components/Modals/BridgeStaking/BridgeSuccess';
import SelectValidator from 'components/Modals/BridgeStaking/SelectValidator';
import ValidatorNode from 'components/Modals/BridgeStaking/ValidatorNode';
import ValidatorDelegation from 'components/Modals/BridgeStaking/ValidatorDelegation';
import ValidatorDelegationSuccess from 'components/Modals/BridgeStaking/ValidatorDelegationSuccess';
import './assets/font-faces.css';

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
                  <Route path="/bridge-success" element={<BridgeSuccess />} />
                  <Route path="/select-validator" element={<SelectValidator />} />
                  <Route path="/validator-node/:id" element={<ValidatorNode />} />
                  <Route
                    path="/validator-delegation"
                    element={<ValidatorDelegation direction="DELEGATE" />}
                  />
                  <Route
                    path="/validator-delegation/success"
                    element={<ValidatorDelegationSuccess />}
                  />
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
