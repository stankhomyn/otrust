import React, { useState } from 'react';
import styled from 'styled-components';
import useInterval from '@use-it/interval';
import { BigNumber } from 'bignumber.js';
import { useOnomyEth } from '@onomy/react-eth';

import { Close, Metamask } from 'components/Modals/Icons';
import { Caret } from '../Icons';
import { format18 } from 'utils/math';
import { useModal } from 'context/modal/ModalContext';
import * as Modal from 'components/Modals/styles';
import 'components/Modals/loadingBar.css';
import { useExchange } from 'context/exchange/ExchangeContext';
import { useGasPriceSelection } from 'hooks/useGasPriceSelection';

const TransactionDetailsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & + & {
    margin-top: 16px;
  }
  span {
    font-weight: 400;
    color: ${props => props.theme.colors.textThirdly};
  }
  strong {
    font-weight: 500;
  }
`;

const OptionsWrapper = styled.section`
  padding: 32px 32px;
  border-top: 1px solid ${props => props.theme.colors.bgHighlightBorder};
`;

const OptionCaption = styled.p`
  margin: 0 0 12px;
  color: ${props => props.theme.colors.textThirdly};
`;

const SlippageDesc = styled.p`
  margin: 16px 0 0;
  color: ${props => props.theme.colors.textSecondary};
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0 16px;
`;

const WalletIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.bgDarken};
  svg {
    width: 24px;
    height: 24px;
  }
`;

const OptionBtn = styled.button<{
  active?: boolean;
}>`
  padding: 12px 16px;
  background-color: ${props =>
    props.active ? props.theme.colors.bgHighlightBorder : 'transparent'};
  border: 1px solid ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 22px;
  font-size: 14px;
  font-weight: 500;
  color: ${props =>
    props.active ? props.theme.colors.textPrimary : props.theme.colors.textSecondary};
  &:hover {
    background-color: ${props => props.theme.colors.bgHighlightBorder_lighten};
  }
  &:active {
    background-color: ${props => props.theme.colors.bgHighlightBorder_darken};
  }
`;

// const FeeWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;

//   margin-top: 16px;

//   color: ${props => props.theme.colors.textThirdly};

//   strong {
//     color: ${props => props.theme.colors.textPrimary};
//   }
// `;

const limitOptions = [
  {
    id: 0,
    text: 'No limit',
    value: new BigNumber(1000),
  },
  {
    id: 1,
    text: '1%',
    value: new BigNumber(100),
  },
  {
    id: 2,
    text: '2.5%',
    value: new BigNumber(250),
  },
  {
    id: 3,
    text: '5%',
    value: new BigNumber(500),
  },
];

export default function ConfirmTransactionModal({
  isApproving,
  submitTrans,
}: {
  isApproving?: boolean;
  // eslint-disable-next-line
  submitTrans: (isApproving: boolean, slippage: BigNumber, gasPrice: BigNumber) => Promise<void>;
}) {
  const [activeSlippageId, setActiveSlippageId] = useState(0);
  const [showSlippageDetails, setShowSlippageDetails] = useState(false);
  const { handleModal } = useModal();
  const { address: account } = useOnomyEth();

  const { askAmount, bidAmount, bidDenom, strong, weak, approve } = useExchange();

  const [count, setCount] = useState(60);
  const [delay, setDelay] = useState<number | null>(1000);

  const increaseCount = () => {
    if (count === 0) {
      setDelay(null);
      handleModal();
    } else {
      setCount(count - 1);
    }
  };

  const { gasPriceChoice, setGasPriceChoice, gasOptions, gasPrice } = useGasPriceSelection();

  useInterval(increaseCount, delay);

  const approveDisplay = parseFloat(approve || '0').toFixed(6);

  return (
    <Modal.Wrapper>
      <Modal.CloseIcon onClick={() => handleModal()} data-testid="confirm-modal-close-icon">
        <Close />
      </Modal.CloseIcon>

      <main>
        <Modal.Caption>Confirm Transaction</Modal.Caption>

        <Modal.ExchangeResult>
          <Modal.ExchangeResultDescription>
            {isApproving ? "You're approving" : "You're receiving"}
          </Modal.ExchangeResultDescription>
          ~ {/* eslint-disable-next-line no-nested-ternary */}
          {isApproving
            ? approveDisplay
            : BigNumber.isBigNumber(askAmount)
            ? format18(askAmount).toFixed(6)
            : ''}{' '}
          {/* eslint-disable-next-line no-nested-ternary */}
          <sup>{isApproving ? 'bNOM' : bidDenom === 'strong' ? 'bNOM' : 'ETH'}</sup>
        </Modal.ExchangeResult>

        <TransactionDetailsRow>
          <span>Current Exchange Rate</span>
          <strong>
            {bidDenom && (
              <>
                {/*
                1 {bidDenom === 'strong' ? strong : weak} ={' '}
                {BigNumber.isBigNumber(bidAmount) ? askAmount.div(bidAmount).toFixed(6) : 'Loading'}
                */}
                1 bNOM ={' '}
                {BigNumber.isBigNumber(bidAmount)
                  ? (bidDenom === 'strong'
                      ? bidAmount.div(askAmount)
                      : askAmount.div(bidAmount)
                    ).toFixed(6)
                  : 'Loading'}
              </>
            )}{' '}
            ETH
            {/*bidDenom === 'strong' ? weak : strong */}
          </strong>
        </TransactionDetailsRow>
        <TransactionDetailsRow>
          <span>{isApproving ? "You're approving" : "You're sending"}</span>
          <strong>
            {isApproving ? approveDisplay : format18(bidAmount).toFixed(6)}{' '}
            {bidDenom === 'strong' ? strong : weak}
          </strong>
        </TransactionDetailsRow>
        <TransactionDetailsRow>
          <div>
            <span>Wallet</span>

            <div>
              <strong>
                {/* eslint-disable-next-line no-nested-ternary */}
                {account === null
                  ? '-'
                  : account
                  ? `${account.substring(0, 10)}...${account.substring(account.length - 4)}`
                  : ''}
              </strong>
            </div>
          </div>

          <WalletIcon>
            <Metamask />
          </WalletIcon>
        </TransactionDetailsRow>
      </main>
      <OptionsWrapper>
        <OptionCaption>Gas Fee</OptionCaption>
        <Options>
          {gasOptions.map(gasPriceOption => (
            <OptionBtn
              active={gasPriceChoice === gasPriceOption.id}
              key={gasPriceOption.text}
              onClick={() => {
                setGasPriceChoice(gasPriceOption.id);
              }}
            >
              {gasPriceOption.text}
            </OptionBtn>
          ))}
        </Options>

        {!isApproving && (
          <Modal.DetailsButton
            active={showSlippageDetails}
            onClick={() => setShowSlippageDetails(!showSlippageDetails)}
            data-testid="confirm-modal-slippage-button"
          >
            Slippage Limit <Caret />
          </Modal.DetailsButton>
        )}

        {showSlippageDetails && (
          <>
            <Options>
              {limitOptions.map(slippageOption => (
                <OptionBtn
                  active={activeSlippageId === slippageOption.id}
                  key={slippageOption.id}
                  onClick={() => setActiveSlippageId(slippageOption.id)}
                >
                  {slippageOption.text}
                </OptionBtn>
              ))}
            </Options>
            <SlippageDesc>
              Slippage is likely in times of high demand. Quote is based on most recent block and
              does not reflect transactions ahead of you in the mempool
            </SlippageDesc>
          </>
        )}
      </OptionsWrapper>
      <footer>
        <Modal.FooterControls>
          <Modal.SecondaryButton
            onClick={() => handleModal()}
            data-testid="confirm-modal-secondary-button"
          >
            Cancel
          </Modal.SecondaryButton>
          <Modal.PrimaryButton
            onClick={() =>
              submitTrans(!!isApproving, limitOptions[activeSlippageId].value, gasPrice)
            }
            data-testid="confirm-modal-primary-button"
          >
            Confirm ({count})
          </Modal.PrimaryButton>
        </Modal.FooterControls>
      </footer>
    </Modal.Wrapper>
  );
}
