import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { BigNumber } from 'bignumber.js';
import { MemoryRouter } from 'react-router-dom';
import { OnomyEthContext } from '@onomy/react-eth';

import { darkNew } from 'theme/theme';
import { ExchangeContext } from '../../context/exchange/ExchangeContext';
import Sidebar from './Sidebar';

describe('Given the Sidebar component and strongBalance, weakBalance are of BigNumber type', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <MemoryRouter>
          <ThemeProvider theme={darkNew}>
            <OnomyEthContext.Provider
              value={{
                blockNumber: 12345678,
                strongBalance: new BigNumber(0),
                weakBalance: new BigNumber(10),
              }}
            >
              <ExchangeContext.Provider value={{ strong: 'ETH', weak: 'bNOM' }}>
                <Sidebar />
              </ExchangeContext.Provider>
            </OnomyEthContext.Provider>
          </ThemeProvider>
        </MemoryRouter>
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});

describe('Given the Sidebar component and strongBalance, weakBalance are NOT of BigNumber type', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <MemoryRouter>
          <ThemeProvider theme={darkNew}>
            <OnomyEthContext.Provider
              value={{
                blockNumber: 12345678,
                strongBalance: 0,
                weakBalance: 10,
                allowance: 'Loading',
              }}
            >
              <ExchangeContext.Provider value={{ strong: 'ETH', weak: 'bNOM' }}>
                <Sidebar />
              </ExchangeContext.Provider>
            </OnomyEthContext.Provider>
          </ThemeProvider>
        </MemoryRouter>
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
