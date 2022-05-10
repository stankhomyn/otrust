import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useOnomyEth } from '@onomy/react-eth';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import useInterval from '@use-it/interval';
import { BigNumber } from 'bignumber.js';
import { useMediaQuery } from 'react-responsive';

import { useGasPriceSelection } from 'hooks/useGasPriceSelection';
import { Close } from '../Icons';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import * as Modal from '../styles';
import { responsive } from 'theme/constants';
import { NOTIFICATION_MESSAGES } from '../../../constants/NotificationMessages';
import BridgeBackgroundImage from '../assets/bridge-top-light-bg.svg';
import WarningIcon from '../assets/warning.svg';

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

const CloseButton = styled(Modal.CloseIcon)`
  top: 16px;
  right: 16px;
`;

const ModalBtn = styled.button`
  width: 44px;
  height: 44px;

  position: absolute;
  top: 6px;
  left: 16px;

  border-radius: 8px;
  border: none;
  background-color: ${props => props.theme.colors.bgHighlightBorder};

  color: #84809a;

  cursor: pointer;
  z-index: 1;
`;

const BridgeButtonSecondary = styled(Modal.SecondaryButton)`
  display: none;
  align-items: center;

  width: auto;
  padding: 12px 24px;
  margin: 24px auto 30px;

  font-family: Poppins, sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: ${props => props.theme.colors.txtSecondary};
  white-space: nowrap;

  &:active {
    color: ${props => props.theme.colors.txtPrimary};
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: flex;
    align-self: end;

    height: 44px;
    margin: 0 0 0 auto;
  }
`;

const BridgeWrapper = styled.div`
  padding: 65px 40px 25px;

  position: relative;

  background-color: ${props => props.theme.colors.bgDarken};
  border-radius: 4px;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    padding: 62px 20px 25px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    padding: 7px 20px 25px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
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

const Warning = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 110px;
  height: 110px;
  margin: 0 auto;

  position: relative;

  background-color: ${props => props.theme.colors.highlightYellow};
  border-radius: 50%;
  outline: 25px solid rgba(255, 221, 161, 0.2);
  box-shadow: 0 0 80px 0 ${props => props.theme.colors.highlightYellow};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin-top: 100px;
    width: 83px;
    height: 83px;
  }
`;

const ImageWrapper = styled.div`
  display: flex;

  width: 55px;
  height: 55px;

  filter: brightness(0);
`;

const BridgeContentWrapper = styled.div`
  position: inherit;
`;

const BridgeTitle = styled.div`
  margin: 110px 0 50px;

  font-family: Barlow Condensed, sans-serif;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  color: #e1dfeb;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin: 66px 0 16px;
    font-size: 20px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    margin: 56px 0;
  }
`;

const WnomMaxContainer = styled.div<{ error?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 0 30px 0;

  border-bottom: 4px solid ${props => (props.error ? props.theme.colors.highlightRed : '#2f2f35')};

  @media screen and (max-width: ${responsive.smartphone}) {
    padding-bottom: 18px;
  }
`;

const MessageWrapper = styled.div`
  margin-top: 10px;

  font-size: 14px;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.highlightRed};
`;

const SuccessMesage = styled.div`
  color: ${props => props.theme.colors.highlightGreen};
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

  font-family: Bebas Neue, sans-serif;
  text-align: center;
  font-size: 80px;
  color: #fbfbfd;
  text-overflow: ellipsis;

  &:focus {
    outline: none;
  }

  &::placeholder {
    padding-left: 40px;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 72px;
  }
`;

const ChangeButtom = styled.button`
  padding: 14px 13px 8px 16px;

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

const TotalApprovedWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: 16px;

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

  font-size: 14px;
  color: #6a6f83;

  span {
    font-weight: 500;
    color: #fbfbfd;
    text-align: right;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    gap: 0;
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

const Message = styled.div`
  margin: 45px 0 10px;

  font-size: 16px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};

  strong {
    color: #85c5f9;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin-top: 30px;

    font-size: 14px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    margin-top: 120px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;

  margin: 30px 0;

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    justify-content: space-between;

    padding: 0 20px;
  }
`;

const SpinerWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const BridgeButton = styled(Modal.SecondaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  width: auto;
  height: auto;
  padding: 16px 40px;

  font-size: 14px;
  white-space: nowrap;
`;

const BridgeButtonPrimary = styled(Modal.PrimaryButton)`
  width: auto;
  height: auto;
  padding: 16px 40px;

  font-size: 14px;
  white-space: nowrap;

  @media screen and (max-width: ${responsive.smartphone}) {
    padding: 16px 20px;
  }
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 12px 0 16px;
`;

const OptionBtn = styled.button<{ active: boolean }>`
  padding: 8px 12px;

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

export default function ApproveTokensBridgeModal({
  amountValue, // string
  allowanceAmountGravity, // BigNumber
  onCancelHandler, // () => void
  formattedWeakBalance, // BigNumber
  weakBalance, // BigNumber
  gasOptions, // { id: number, text: string, gas: BigNumber }
  gasPriceChoice, // number
  setGasPriceChoice, // (id: number) => void
  gasPrice, // BigNumber
}: {
  amountValue: string;
  allowanceAmountGravity: BigNumber; // TODO: incompatible BigNumber coming in here
  onCancelHandler: () => void;
  formattedWeakBalance: BigNumber;
  weakBalance: BigNumber;
  gasOptions: ReturnType<typeof useGasPriceSelection>['gasOptions'];
  gasPriceChoice: number;
  setGasPriceChoice: (choice: number) => void;
  gasPrice: BigNumber;
}) {
  const [count, setCount] = useState(60);
  const [delay, setDelay] = useState<number | null>(1000);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [approveAmountInputValue, setApproveAmountInputValue] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isTransactionCompleted, setIsTransactionCompleted] = useState(false);
  const { bondingCurve } = useOnomyEth();

  const BreakpointSmartphone = useMediaQuery({ minWidth: responsive.smartphone });
  const BreakpointSmartphoneLarge = useMediaQuery({ minWidth: responsive.smartphoneLarge });

  useEffect(() => {
    if (amountValue && allowanceAmountGravity) {
      const amountBigNum = new BigNumber(amountValue).shiftedBy(18);
      const approveAmount = amountBigNum.minus(new BigNumber(allowanceAmountGravity.toString()));
      const formattedApproveAmount = approveAmount.shiftedBy(-18).toString(10);
      setApproveAmountInputValue(formattedApproveAmount);
    }
  }, [amountValue, allowanceAmountGravity]);

  const handleApproveAmountInputChange = (event: { target: { value: any } }) => {
    const { value } = event.target;
    const floatRegExp = new RegExp(
      /(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d{1,18})?$)|(^\d+?\.$)|(^\+?(?!0\d+)$|(^$)|(^\.$))/
    );
    if (floatRegExp.test(value)) {
      setApproveAmountInputValue(value);
    }
  };

  const increaseCount = () => {
    if (count === 0) {
      setDelay(null);
      onCancelHandler();
    } else {
      setCount(count - 1);
    }
  };

  useInterval(increaseCount, delay);

  const maxBtnHandler = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (formattedWeakBalance) {
      const maxFormatted = weakBalance.minus(allowanceAmountGravity).shiftedBy(-18).toString(10);
      setApproveAmountInputValue(maxFormatted);
    }
  };

  const confirmApproveHandler = useCallback(
    async event => {
      event.preventDefault();
      if (approveAmountInputValue === '.' || !approveAmountInputValue) return;

      try {
        setErrorMessage('');
        setSuccessMessage('');
        setIsBtnDisabled(true);
        setDelay(null);
        setShowLoader(true);

        await bondingCurve.bNomIncreaseBridgeAllowance(
          new BigNumber(approveAmountInputValue).shiftedBy(18),
          gasPrice
        );

        setSuccessMessage(
          NOTIFICATION_MESSAGES.success.approvedBridgeTokens(approveAmountInputValue)
        );
        setIsTransactionCompleted(true);
      } catch (error: any) {
        if (error.code === 4001) {
          setErrorMessage(NOTIFICATION_MESSAGES.error.rejectedTransaction);
        } else {
          setErrorMessage(error.message);
        }
      } finally {
        setShowLoader(false);
        setIsBtnDisabled(false);
      }
    },
    [bondingCurve, approveAmountInputValue, gasPrice]
  );

  let infoMessage;
  const amountDisplay = parseFloat(amountValue || '0');

  if (allowanceAmountGravity?.gt(0)) {
    const formattedAllowanceAmountGravity = new BigNumber(allowanceAmountGravity.toString())
      .shiftedBy(-18)
      .toString(10);
    infoMessage = (
      <Message>
        You have approved bridging of up to <strong>{formattedAllowanceAmountGravity} bNOM</strong>.
        To bridge <strong>{amountDisplay} bNOM</strong>, you must approve at least an additional{' '}
        <strong>{approveAmountInputValue} bNOM</strong>.
      </Message>
    );
  } else {
    infoMessage = (
      <Message>
        You must approve <strong>{amountDisplay} bNOM</strong> for bridging to the Onomy Network.
        Your bNOM will be burned and you will receive an equivalent number of NOM tokens in your
        Onomy Wallet. After approval, you may submit a bridge transaction!
      </Message>
    );
  }

  return (
    <ModalBody>
      <BridgeWrapper>
        {BreakpointSmartphoneLarge ? (
          <Link to="/">
            <CloseButton
              disabled={isBtnDisabled}
              data-testid="approve-tokens-modal-secondary-button"
            >
              <Close />
            </CloseButton>
          </Link>
        ) : (
          <>
            <ModalBtn
              onClick={onCancelHandler}
              disabled={isBtnDisabled}
              data-testid="approve-tokens-modal-secondary-button"
            >
              <FontAwesomeIcon icon={faChevronLeft as IconProp} />
            </ModalBtn>

            <Link to="/bridge-initial">
              <BridgeButtonSecondary type="button">What is Onomy Bridge?</BridgeButtonSecondary>
            </Link>
          </>
        )}
        <BridgeBackground>
          <img src={BridgeBackgroundImage} alt="" />
        </BridgeBackground>
        <Warning>
          <ImageWrapper>
            <img src={WarningIcon} alt="" />
          </ImageWrapper>
        </Warning>
        <BridgeContentWrapper>
          <BridgeTitle>Approve additional wNOM for bridging</BridgeTitle>
          <WnomMaxContainer>
            <Wnom>Wnom</Wnom>
            <InputValue
              type="text"
              placeholder="0 .00"
              value={approveAmountInputValue}
              onChange={handleApproveAmountInputChange}
              disabled={isBtnDisabled}
            />
            <ChangeButtom type="button" onClick={maxBtnHandler} disabled={isBtnDisabled}>
              Change
            </ChangeButtom>
          </WnomMaxContainer>
          <MessageWrapper>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            {successMessage && <SuccessMesage>{successMessage}</SuccessMesage>}
          </MessageWrapper>
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
          {infoMessage}
        </BridgeContentWrapper>
        <Row>
          Gas Fee
          <Options>
            {gasOptions.map(gasPriceOption => (
              <OptionBtn
                active={gasPriceChoice === gasPriceOption.id}
                key={gasPriceOption.id}
                onClick={e => {
                  e.preventDefault();
                  setGasPriceChoice(gasPriceOption.id);
                }}
                disabled={isBtnDisabled}
              >
                {gasPriceOption.text}
              </OptionBtn>
            ))}
          </Options>
        </Row>
      </BridgeWrapper>
      <ButtonWrapper>
        {showLoader ? (
          <SpinerWrapper>
            <LoadingSpinner />
          </SpinerWrapper>
        ) : (
          <>
            {!isTransactionCompleted && (
              <>
                <BridgeButton
                  onClick={onCancelHandler}
                  disabled={isBtnDisabled}
                  data-testid="approve-tokens-modal-secondary-button"
                >
                  Back
                </BridgeButton>
                <BridgeButtonPrimary
                  onClick={confirmApproveHandler}
                  disabled={isBtnDisabled}
                  data-testid="approve-tokens-modal-primary-button"
                >
                  Approve & Bridge ({count})
                </BridgeButtonPrimary>
              </>
            )}
            {isTransactionCompleted && (
              <BridgeButtonPrimary onClick={onCancelHandler} style={{ margin: 'auto' }}>
                Return to Bridge Screen
              </BridgeButtonPrimary>
            )}
          </>
        )}
      </ButtonWrapper>
    </ModalBody>
  );
}
