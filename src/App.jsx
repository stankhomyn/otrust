import React from 'react';
import { ThemeProvider } from 'styled-components';
import { CookiesProvider } from 'react-cookie';

import MainHeader from 'components/MainHeader';
import BondingCurve from 'pages/BondingCurve';
import { darkNew } from 'theme/theme';
import { GlobalStyle } from 'theme/GlobalStyle';
import { AutoLogin } from 'context/AutoLogin';
import ChainProvider from 'context/chain/ChainContext';
import ExchangeProvider from 'context/exchange/ExchangeContext';
import ModalProvider from 'context/modal/ModalContext';
// import BridgeSuccess from 'components/Modals/BridgeStaking/BridgeSuccess';
// import SelectValidator from 'components/Modals/BridgeStaking/SelectValidator';
// import ValidatorNode from 'components/Modals/BridgeStaking/ValidatorNode';
// import ValidatorDelegation from 'components/Modals/BridgeStaking/ValidatorDelegation';
// import ValidatorDelegationSuccess from 'components/Modals/BridgeStaking/ValidatorDelegationSuccess';
import './assets/font-faces.css';

function App() {
  return (
    <CookiesProvider>
      <ThemeProvider theme={darkNew}>
        <AutoLogin>
          <ChainProvider theme={darkNew}>
            {/* <BridgeSuccess /> */}
            {/* <SelectValidator /> */}
            {/* <ValidatorNode /> */}
            {/* <ValidatorDelegation direction="UNDELEGATE" /> */}
            {/* <ValidatorDelegationSuccess direction="UNDELEGATE" /> */}

            <ExchangeProvider>
              <ModalProvider>
                <GlobalStyle />
                <MainHeader />
                <BondingCurve />
              </ModalProvider>
            </ExchangeProvider>
          </ChainProvider>
        </AutoLogin>
      </ThemeProvider>
    </CookiesProvider>
  );
}

export default App;
