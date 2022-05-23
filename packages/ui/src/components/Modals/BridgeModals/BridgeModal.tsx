import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useOnomy } from '@onomy/react-client';
import { useOnomyEth } from '@onomy/react-eth';
import { useMediaQuery } from 'react-responsive';

import { Dimmer } from 'components/UI/Dimmer';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import BridgeApproveTokens from './BridgeApproveTokens';
import BridgeTransactionComplete from './BridgeTransactionComplete';
import { getFirstMessage } from '../../../utils/helpers';
import { Close } from '../Icons';
import * as Modal from '../styles';
import { responsive } from 'theme/constants';
import BridgeBackgroundImage from '../assets/bridge-top-light-bg.svg';

const ModalBody = styled.div`
  width: 770px;
  padding: 4px;

  position: absolute;
  top: 50%;
  left: 50%;

  background-color: ${props => props.theme.colors.bgNormal};
  border-radius: 8px;

  transform: translate(-50%, -50%);
  z-index: 11;

  ${Modal.CloseIcon} {
    top: 20px;
    right: 20px;

    z-index: 1;
  }

  a {
    text-decoration: none;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    width: 700px;

    top: 30px;

    transform: translateX(-50%);
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    width: 100%;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    padding: 0;

    top: 0;

    border-radius: 0;
  }
`;

const ModalBtn = styled.button`
  width: 44px;
  height: 44px;

  position: absolute;
  top: 10px;
  left: 20px;

  border-radius: 8px;
  border: none;
  background-color: ${props => props.theme.colors.bgHighlightBorder};

  color: #84809a;

  cursor: pointer;
  z-index: 1;
`;

const BridgeWrapper = styled.div`
  padding: 65px 40px 35px;

  font-size: 14px;
  font-weight: 500;

  position: relative;

  background-color: ${props => props.theme.colors.bgDarken};
  border-radius: 4px;

  @media screen and (max-width: ${responsive.tablet}) {
    padding: 28px 20px 25px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    padding: 7px 20px 25px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    padding: 10px 20px 32px;

    background-color: #0a090e;
    border-radius: 0;
  }
`;

const BridgeBackground = styled.div`
  position: absolute;
  top: -22px;
  left: 50%;

  transform: translateX(-50%);

  @media screen and (max-width: ${responsive.tablet}) {
    width: 627px;
    height: 108px;
    overflow: hidden;

    &:before {
      content: '';

      width: inherit;
      height: 90px;

      position: absolute;
      top: 20px;

      background: linear-gradient(
        to bottom,
        rgba(26, 23, 35, 0) 0%,
        ${props => props.theme.colors.bgDarken} 100%
      );
    }

    img {
      width: 100%;
    }
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: none;
  }
`;

const BridgeContentWrapper = styled.div`
  position: inherit;
`;

const HeaderWrapper = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.bgHighlight};

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: flex;
    flex-direction: column-reverse;
    gap: 32px;

    padding-bottom: 5px;
  }
`;

const RewardWrapper = styled.div`
  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    gap: 10px;
  }
`;

const RewardRate = styled.div`
  margin-bottom: 12px;

  font-family: Bebas Neue, sans-serif;
  font-size: 80px;
  font-weight: 300;
  letter-spacing: 7.2px;
  text-align: center;
  color: #85c5f9;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin-bottom: 0;

    font-size: 64px;
  }
`;

const BridgeRewardTitle = styled.div`
  width: 268px;
  margin: 0 auto;

  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  line-height: 2;
  letter-spacing: 3.96px;
  text-align: center;
  color: #ddd8e6;

  opacity: 0.5;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    letter-spacing: 1.44px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    margin: 0;

    text-align: left;
  }
`;

const BridgeTitle = styled.div`
  padding-top: 35px;
  margin-bottom: 30px;

  font-family: Barlow Condensed, sans-serif;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  color: ${props => props.theme.colors.txtPrimary};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 20px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    text-align: left;
  }
`;

const WnomMaxContainer = styled.div<{ error?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 0 40px 0;

  border-bottom: 4px solid ${props => (props.error ? props.theme.colors.highlightRed : '#2f2f35')};

  @media screen and (max-width: ${responsive.smartphone}) {
    padding-bottom: 18px;
  }
`;

const Wnom = styled.div`
  font-family: Bebas Neue, sans-serif;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: #fbfbfd;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 16px;
  }

  @media screen and (max-width: ${responsive.smartphone}) {
    margin-right: 16px;
  }
`;

const InputValue = styled.input`
  width: 100%;
  padding: 0 20px;

  background-color: transparent;
  border: none;

  font-family: Barlow Condensed, sans-serif;
  text-align: center;
  font-size: 100px;
  color: #fbfbfd;
  text-overflow: ellipsis;

  &:focus {
    outline: none;
  }

  &::placeholder {
    padding-left: 20px;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 72px;
  }
`;

const MaxButtom = styled.button`
  padding: 12px 13px 8px 16px;

  border-radius: 26px;
  border: none;
  background-color: ${props => props.theme.colors.bgHighlight};

  font-family: Bebas Neue, sans-serif;
  font-size: 20px;
  font-weight: bold;
  line-height: 0.8;
  letter-spacing: 2.4px;
  color: #85c5f9;

  &:disabled {
    color: #656273;

    cursor: not-allowed;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 16px;
    letter-spacing: 1.92px;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 16px;
    padding: 12px 13px 8px 14px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    margin-left: auto;
  }
`;

const BridgeButtonSecondary = styled(Modal.SecondaryButton)`
  display: flex;
  align-items: center;

  width: auto;
  padding: 12px 24px;
  margin: 24px auto 30px;

  font-family: Poppins, sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: ${props => props.theme.colors.txtSecondary};
  white-space: nowrap;

  &:active:enabled {
    color: ${props => props.theme.colors.txtPrimary};
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin: 8px auto 16px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    align-self: end;

    height: 44px;

    margin: 0 0 0 auto;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 10px;

  font-size: 14px;
  color: ${props => props.theme.colors.highlightRed};
  overflow-wrap: break-word;
`;

const TotalApprovedWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: 16px;

  font-size: 14px;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    gap: 40px;

    font-size: 12px;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 15px;

  width: 100%;

  color: #6a6f83;

  span {
    font-weight: 500;
    color: #fbfbfd;
    text-align: right;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    gap: 5px;
  }
`;

const CellDivider = styled.div`
  width: 2px;
  height: 21px;
  margin: 0 20px;

  background-color: ${props => props.theme.colors.bgHighlight};

  @media screen and (max-width: ${responsive.smartphone}) {
    display: none;
  }
`;

const BridgeInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  padding-top: 16px;
  margin: 50px 0 0;

  border-top: 1px solid ${props => props.theme.colors.bgHighlight};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin-top: 120px;

    font-size: 12px;
  }
`;

const CellStatus = styled.div<{
  active?: boolean;
  disconnected?: boolean;
}>`
  color: ${props =>
    props.active ? props.theme.colors.highlightGreen : props.theme.colors.highlightRed};
`;

const CellData = styled.div`
  margin-left: auto;
  color: ${props => props.theme.colors.textSecondary};
  text-align: right;
  font-weight: 500;
  white-space: nowrap;
`;

const TooltipChange = styled.div<{ active: boolean }>`
  position: relative;

  font-family: Poppins, sans-serif;
  color: ${props => (props.active ? '#506e8e' : '#85c5f9')};

  cursor: pointer;
`;

const HintTooltip = styled.div<{ active: boolean }>`
  width: 360px;
  padding: 32px 40px;

  position: absolute;
  left: 77px;
  top: -100px;

  color: #e1dfeb;

  background-color: #302e3d;
  border-radius: 8px;
  box-shadow: 0 5px 50px 0 rgba(0, 0, 0, 0.36);
  visibility: ${props => (props.active ? 'visible' : 'hidden')};

  z-index: 10;
  cursor: pointer;

  &:after {
    content: '';
    display: block;

    width: 0;
    height: 0;

    position: absolute;
    left: -20px;
    top: 80px;

    border-top: 30px solid transparent;
    border-bottom: 30px solid transparent;
    border-right: 30px solid #302e3d;
  }

  @media screen and (max-width: ${responsive.tablet}) {
    left: auto;
    right: 85px;

    &:after {
      left: auto;
      right: -55px;

      border-right: 30px solid transparent;
      border-left: 30px solid #302e3d;
    }
  }

  @media screen and (max-width: ${responsive.smartphone}) {
    padding: 20px;

    left: auto;
    right: -10px;
    top: 35px;

    &:after {
      top: -50px;
      left: auto;
      right: 5px;

      border-top: 30px solid transparent;
      border-bottom: 30px solid #302e3d;
      border-right: 30px solid transparent;
      border-left: 30px solid transparent;
    }
  }
`;

const HintTitle = styled.div`
  margin-bottom: 16px;

  font-size: 16px;
  font-weight: 500;
  color: #e1dfeb;
`;

const HintText = styled.div`
  padding-bottom: 24px;

  border-bottom: 1px solid #444157;

  font-size: 14px;
  color: #9895a6;
`;

const HintButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: 24px;
`;

const HintButtonSecondary = styled(Modal.SecondaryButton)`
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;

  font-size: 14px;
  color: #e1dfeb;
  text-shadow: 0 6px 3px rgba(0, 0, 0, 0.03);

  &:active,
  &:hover {
    background-color: transparent;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;

  margin: 40px 0;

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    ${Modal.PrimaryButton} {
      width: 90%;
    }
  }
`;

const BridgeButtonPrimary = styled(Modal.PrimaryButton)`
  width: auto;
  height: auto;
  padding: 17px 40px;

  font-size: 14px;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const OptionBtn = styled.button<{ active?: boolean }>`
  padding: 8px;

  background-color: ${props =>
    props.active ? props.theme.colors.bgHighlightBorder : 'transparent'};
  border: 1px solid ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 22px;

  font-size: 12px;
  color: ${props =>
    props.active ? props.theme.colors.textPrimary : props.theme.colors.textSecondary};

  &:hover:enabled {
    background-color: ${props => props.theme.colors.bgHighlightBorder_lighten};
  }

  &:active {
    background-color: ${props => props.theme.colors.bgHighlightBorder_darken};
  }

  &:disabled {
    color: #656273;

    cursor: not-allowed;
  }
`;

export interface BridgeSwapModalProps {
  values: {
    onomyWalletValue: string;
    amountValue: string;
    formattedWeakBalance: BigNumber;
    allowanceAmountGravity: BigNumber;
    weakBalance: BigNumber;
    errors: {
      amountError: string;
      onomyWalletError: string;
      transactionError: string;
    };
    gasPrice: BigNumber;
    gasPriceChoice: number;
    gasOptions: {
      id: number;
      text: string;
      gas: BigNumber;
    }[];
  };
  flags: {
    isDisabled: boolean;
    isTransactionPending: boolean;
    showBridgeExchangeModal: boolean;
    showApproveModal: boolean;
    showTransactionCompleted: boolean;
    showLoader: boolean;
  };
  handlers: {
    walletChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
    amountChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
    maxBtnClickHandler: React.MouseEventHandler<HTMLButtonElement>;
    submitTransClickHandler: React.MouseEventHandler<HTMLButtonElement>;
    onCancelClickHandler: () => void;
    closeModal: () => void;
    setGasPriceChoice: React.Dispatch<React.SetStateAction<number>>;
  };
}

export default function BridgeSwapModal({ ...props }: BridgeSwapModalProps) {
  const { active, address: account } = useOnomyEth();
  const [activeHint, setActiveHint] = useState(false);
  const { values, flags, handlers } = { ...props };
  const { bridgeProgress } = useOnomy();

  const BreakpointSmartphone = useMediaQuery({ minWidth: responsive.smartphone });
  const BreakpointSmartphoneLarge = useMediaQuery({ minWidth: responsive.smartphoneLarge });

  const closeModal = () => {
    if (!bridgeProgress) handlers.closeModal();
  };

  return (
    <>
      <Dimmer onClick={closeModal} disabled={!!bridgeProgress} />
      <ModalBody>
        {BreakpointSmartphoneLarge ? (
          <Modal.CloseIcon onClick={closeModal} disabled={!!bridgeProgress}>
            <Close />
          </Modal.CloseIcon>
        ) : (
          <ModalBtn onClick={closeModal} disabled={!!bridgeProgress}>
            <FontAwesomeIcon icon={faChevronLeft as IconProp} />
          </ModalBtn>
        )}

        {flags.showBridgeExchangeModal && (
          <>
            <BridgeWrapper>
              <BridgeBackground>
                <img src={BridgeBackgroundImage} alt="" />
              </BridgeBackground>
              <BridgeContentWrapper>
                <HeaderWrapper>
                  <RewardWrapper>
                    <RewardRate>440%</RewardRate>
                    <BridgeRewardTitle>Estimated Annual Staking Reward Rate</BridgeRewardTitle>
                  </RewardWrapper>
                  <Link to="/bridge-initial">
                    <BridgeButtonSecondary type="button" disabled={!!bridgeProgress}>
                      What is Onomy Bridge?
                    </BridgeButtonSecondary>
                  </Link>
                </HeaderWrapper>
                <BridgeTitle>Bridge and stake NOM to earn staking rewards!</BridgeTitle>
                <WnomMaxContainer error={values.errors.amountError}>
                  <Wnom>Wnom</Wnom>
                  <InputValue
                    placeholder="0  .00"
                    type="text"
                    value={values.amountValue}
                    onChange={handlers.amountChangeHandler}
                    disabled={flags.isTransactionPending}
                  />
                  <MaxButtom
                    onClick={handlers.maxBtnClickHandler}
                    disabled={flags.isTransactionPending}
                  >
                    Max
                  </MaxButtom>
                </WnomMaxContainer>
                {getFirstMessage(values.errors) && (
                  <ErrorMessage>{getFirstMessage(values.errors)}</ErrorMessage>
                )}
                <TotalApprovedWrapper>
                  <Row>
                    {BreakpointSmartphone ? 'Total wNOM Balance' : 'Balance'}
                    <span>30 329 wNOM</span>
                  </Row>
                  <CellDivider />
                  <Row>
                    {BreakpointSmartphone ? 'Approved  wNOM' : 'Approved'}
                    <span>30 329 wNOM</span>
                  </Row>
                </TotalApprovedWrapper>
              </BridgeContentWrapper>

              <BridgeInfo>
                <Row>
                  Gas Fee
                  <Options>
                    {values.gasOptions.map(gasPriceOption => (
                      <OptionBtn
                        active={values.gasPriceChoice === gasPriceOption.id}
                        key={gasPriceOption.id}
                        onClick={e => {
                          e.preventDefault();
                          handlers.setGasPriceChoice(gasPriceOption.id);
                        }}
                        disabled={flags.isTransactionPending}
                      >
                        {gasPriceOption.text}
                      </OptionBtn>
                    ))}
                  </Options>
                </Row>
                <Row>
                  Bridge Status
                  <CellStatus active={active}>
                    {active ? 'Connected' : 'Wallet Disconnected'}
                  </CellStatus>
                </Row>
                <Row>
                  Onomy Access Wallet
                  <CellData>
                    {account
                      ? `${account.substring(0, 16)}...${account.substring(account.length - 3)}`
                      : ''}
                  </CellData>
                  <TooltipChange
                    onPointerOver={() => setActiveHint(true)}
                    onPointerLeave={() => setActiveHint(false)}
                    active={activeHint}
                  >
                    Change
                    <HintTooltip active={activeHint}>
                      <HintTitle>Change the wallet</HintTitle>
                      <HintText>
                        Are you sure you want to change the wallet? After this action you’ll have to
                        connect your wallet again
                      </HintText>
                      <HintButtonWrapper>
                        <HintButtonSecondary
                          type="button"
                          onClick={() => setActiveHint(false)}
                          disabled={flags.isTransactionPending}
                        >
                          No, thanks
                        </HintButtonSecondary>
                        <Link to="/bridge-wallets">
                          <BridgeButtonPrimary
                            type="button"
                            onClick={closeModal}
                            disabled={flags.isTransactionPending}
                          >
                            Change wallet
                          </BridgeButtonPrimary>
                        </Link>
                      </HintButtonWrapper>
                    </HintTooltip>
                  </TooltipChange>
                </Row>
                <Row>
                  Onomy Access NOM Balance
                  <CellData>{`${values.formattedWeakBalance.toFixed(6)}`} NOM</CellData>
                </Row>
              </BridgeInfo>
            </BridgeWrapper>
            <ButtonWrapper>
              {flags.showLoader ? (
                <LoadingSpinner />
              ) : (
                <BridgeButtonPrimary
                  type="button"
                  onClick={handlers.submitTransClickHandler}
                  disabled={flags.isDisabled || !active}
                >
                  Swap wNOM for NOM
                </BridgeButtonPrimary>
              )}
            </ButtonWrapper>
          </>
        )}
      </ModalBody>

      {flags.showApproveModal && (
        <BridgeApproveTokens
          {...props}
          onCancelHandler={handlers.onCancelClickHandler}
          amountValue={values.amountValue}
          allowanceAmountGravity={values.allowanceAmountGravity}
          formattedWeakBalance={values.formattedWeakBalance}
          weakBalance={values.weakBalance}
          gasOptions={values.gasOptions}
          gasPriceChoice={values.gasPriceChoice}
          gasPrice={values.gasPrice}
          setGasPriceChoice={handlers.setGasPriceChoice}
        />
      )}

      {flags.showTransactionCompleted && (
        <BridgeTransactionComplete amountValue={values.amountValue} />
      )}
    </>
  );
}
