import React from 'react';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { BigNumber } from 'bignumber.js';
import { OnomyEthContext } from '@onomy/react-eth';

import { darkNew } from 'theme/theme';
import { ExchangeContext, UpdateExchangeContext } from '../context/exchange/ExchangeContext';
import { ModalContext } from '../context/modal/ModalContext';

export const renderWithTheme = (Component, props, children) => {
  if (children) {
    return render(
      <MemoryRouter>
        <ThemeProvider theme={darkNew}>
          <Component {...props}>{children}</Component>
        </ThemeProvider>
      </MemoryRouter>
    );
  }
  return render(
    <MemoryRouter>
      <ThemeProvider theme={darkNew}>
        <Component {...props} />
      </ThemeProvider>
    </MemoryRouter>
  );
};

export const ThemeWrapper = (Component, props, children) => {
  return (
    <ThemeProvider theme={darkNew}>
      <Component {...props}>{children}</Component>
    </ThemeProvider>
  );
};

export const ChainContextWrapper = (children, contextProps) => {
  return (
    <OnomyEthContext.Provider
      value={{
        blockNumber: BigNumber(0),
        currentETHPrice: BigNumber(0),
        currentNOMPrice: BigNumber(0),
        NOMallowance: BigNumber(0),
        strongBalance: BigNumber(0),
        supplyNOM: BigNumber(0),
        weakBalance: BigNumber(0),
        ...contextProps,
      }}
    >
      {children}
    </OnomyEthContext.Provider>
  );
};

export const ExchangeContextWrapper = (children, contextProps) => {
  return (
    <ExchangeContext.Provider
      value={{
        askAmount: BigNumber(0),
        bidAmount: BigNumber(0),
        bidDenom: 'strong',
        status: 'Not Approved',
        strong: 'ETH',
        weak: 'NOM',
        ...contextProps,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export const UpdateExchangeContextWrapper = (children, contextProps) => {
  return (
    <UpdateExchangeContext.Provider
      value={{
        objDispatch: () => {},
        strDispatch: () => {},
        setInputPending: false,
        ...contextProps,
      }}
    >
      {children}
    </UpdateExchangeContext.Provider>
  );
};

export const ModalContextWrapper = (children, contextProps) => {
  return (
    <ModalContext.Provider
      value={{
        handleModal: () => {},
        modal: false,
        modalContent: 'Modal Content',
        ...contextProps,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const renderWithContext = (Component, props, contextValues) => {
  return render(
    <ThemeProvider theme={darkNew}>
      <OnomyEthContext.Provider
        value={{
          supplyNOM: BigNumber(0),
          blockNumber: BigNumber(0),
          currentETHPrice: BigNumber(0),
          currentNOMPrice: BigNumber(0),
          NOMallowance: BigNumber(0),
          strongBalance: BigNumber(0),
          weakBalance: BigNumber(0),
          ...contextValues,
        }}
      >
        <UpdateExchangeContext.Provider
          value={{
            objDispatch: jest.fn(),
            strDispatch: jest.fn(),
            setInputPending: false,
            ...contextValues,
          }}
        >
          <ExchangeContext.Provider
            value={{
              askAmount: BigNumber(0),
              bidAmount: BigNumber(0),
              bidDenom: 'strong',
              status: 'Not Approved',
              strong: 'ETH',
              weak: 'NOM',
              ...contextValues,
            }}
          >
            <ModalContext.Provider
              value={{
                handleModal: jest.fn(),
                modal: false,
                modalContent: 'Modal Content',
                ...contextValues,
              }}
            >
              <Component {...props} />
            </ModalContext.Provider>
          </ExchangeContext.Provider>
        </UpdateExchangeContext.Provider>
      </OnomyEthContext.Provider>
    </ThemeProvider>
  );
};
