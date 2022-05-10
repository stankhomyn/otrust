import React from 'react';
import styled from 'styled-components';
import { useOnomy } from '@onomy/react-client';

import { responsive } from 'theme/constants';
import { BridgeProgress } from 'components/BridgeProgress';
import * as Modal from '../styles';
import BridgeSuccess from '../BridgeStaking/BridgeSuccess';
import {
  MyBridgedNomBalanceDisplay,
  MyWrappedNomBalanceDisplay,
} from 'components/NomBalanceDisplay';
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
    z-index: 1;
  }

  @media screen and (max-width: ${responsive.tablet}) {
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

    background-color: #0a090e;
    border-radius: 0;
  }
`;

const BridgeWrapper = styled.div`
  padding: 55px 40px 25px;

  position: relative;

  background-color: ${props => props.theme.colors.bgDarken};
  border-radius: 4px;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    padding: 50px 20px 25px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    padding: 100px 20px 10px;
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

const BridgeContentWrapper = styled.div`
  position: inherit;
`;

const BridgeText = styled.p`
  margin: 16px 0 40px;

  font-size: 16px;
  text-align: center;
  color: ${props => props.theme.colors.txtSecondary};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin-top: 16px;

    font-size: 14px;
  }
`;

const Value = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 32px 0 24px;

  font-family: Bebas Neue, sans-serif;
  font-size: 48px;
  color: ${props => props.theme.colors.txtThirdly};
  letter-spacing: 1.44px;

  border-radius: 6px;
  background-color: ${props => props.theme.colors.bgNormal};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    padding: 20px 0 14px;
    font-size: 40px;
  }

  @media screen and (max-width: ${responsive.smartphone}) {
    font-size: 28px;
  }
`;

const Modify = styled.span`
  display: flex;
  align-items: center;

  color: ${props => props.theme.colors.txtPrimary};
`;

const Slash = styled.div`
  width: 2px;
  height: 48px;
  margin: 0 25px;

  position: relative;
  top: -4px;

  background-color: ${props => props.theme.colors.txtThirdly};
  transform: rotate(20deg);
`;

const Currency = styled.span`
  padding-left: 16px;

  font-size: 24px;
  letter-spacing: 0.96px;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 20px;
  }

  @media screen and (max-width: ${responsive.smartphone}) {
    font-size: 16px;
  }
`;

const BridgeInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  padding-top: 16px;
  margin: 55px 0 0;

  font-size: 14px;
  font-weight: 500;

  border-top: 1px solid ${props => props.theme.colors.bgHighlight};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin-top: 30px;

    font-size: 12px;
  }

  @media screen and (max-width: ${responsive.smartphone}) {
    margin-top: 140px;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;

  color: #6a6f83;
`;

const CellData = styled.div`
  color: ${props => props.theme.colors.txtSecondary};
  text-align: right;
`;

const CrossData = styled.span`
  padding-right: 16px;

  text-decoration: line-through;
  color: #6a6f83;
`;

export default function BridgeTransactionComplete({ amountValue }: { amountValue?: string }) {
  const { bridgeProgress } = useOnomy();

  if (bridgeProgress === null) {
    return <BridgeSuccess amountValue={amountValue} />;
  }
  return (
    <ModalBody>
      <BridgeWrapper>
        <BridgeBackground>
          <img src={BridgeBackgroundImage} alt="" />
        </BridgeBackground>
        <BridgeProgress />
        <BridgeContentWrapper>
          <BridgeText>
            Once NOM is in your wallet, you can start earning rewards by staking! You may manage
            staking at any point in the future, as well
          </BridgeText>
          <Value data-testid="completed-modal-exchange-result">
            <Modify>
              + {amountValue}
              <Currency>NOM</Currency>
            </Modify>
            <Slash />– {amountValue}
            <Currency>wNOM</Currency>
          </Value>
          <BridgeInfo data-testid="completed-modal-exchange-rate">
            <Row>
              Exchange Rate
              <CellData>1 NOM = 1WNOM</CellData>
            </Row>
            <Row>
              Transaction Fee
              <CellData>1954.24 NOM</CellData>
            </Row>
            <Row>
              New NOM balance
              <CellData>
                <CrossData>1410.24 NOM</CrossData>
                <MyBridgedNomBalanceDisplay /> NOM
              </CellData>
            </Row>
            <Row>
              New wNOM balance
              <CellData>
                <CrossData>2044.24 wNOM</CrossData>
                <MyWrappedNomBalanceDisplay /> wNOM
              </CellData>
            </Row>
          </BridgeInfo>
        </BridgeContentWrapper>
      </BridgeWrapper>
    </ModalBody>
  );
}
