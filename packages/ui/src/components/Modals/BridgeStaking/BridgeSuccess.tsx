import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

import * as Modal from '../styles';
import { Dimmer } from 'components';
import { responsive } from 'theme/constants';
import { Close } from '../Icons';
import {
  MyBridgedNomBalanceDisplay,
  MyWrappedNomBalanceDisplay,
} from 'components/NomBalanceDisplay';
import BridgeBackgroundImage from '../assets/bridge-top-light-bg.svg';
import successSrc from '../assets/check.svg';

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

  a {
    text-decoration: none;
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

const CloseButton = styled(Modal.CloseIcon)`
  top: 20px;
  right: 20px;
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

const BridgeButtonSecondary = styled(Modal.SecondaryButton)`
  display: none;

  &:active {
    color: ${props => props.theme.colors.txtPrimary};
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    display: block;
    width: auto;
    height: 44px;
    padding: 12px 24px;

    position: absolute;
    top: 10px;
    right: 15px;

    font-family: Poppins, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: ${props => props.theme.colors.txtSecondary};
    white-space: nowrap;

    z-index: 10;
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

const Success = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 110px;
  height: 110px;
  margin: 0 auto;

  position: relative;

  background-color: #85c5f9;
  border-radius: 50%;
  outline: 25px solid rgba(133, 197, 249, 0.2);
  box-shadow: 0 0 80px 0 #85c5f9;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    width: 83px;
    height: 83px;
  }
`;

const ImageWrapper = styled.div`
  display: flex;

  width: 55px;
  height: 55px;
`;

const BridgeContentWrapper = styled.div`
  position: inherit;
`;

const BridgeTitle = styled.div`
  margin: 80px 0 16px;

  font-family: Barlow Condensed, sans-serif;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  color: ${props => props.theme.colors.txtPrimary};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin: 35px 0 16px;
    font-size: 20px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    margin: 56px 0;
  }
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
  color: #656273;
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

  background-color: #656273;
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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;

  margin: 45px 0 40px;
`;

const BridgeButtonPrimary = styled(Modal.PrimaryButton)`
  width: auto;
  height: auto;
  padding: 17px 40px;

  font-size: 14px;
`;

export default function BridgeSuccess({ amountValue = '0' }) {
  const BreakpointSmartphoneLarge = useMediaQuery({ minWidth: responsive.smartphoneLarge });

  return (
    <>
      <Dimmer />
      <ModalBody>
        {BreakpointSmartphoneLarge ? (
          <Link to="/">
            <CloseButton>
              <Close />
            </CloseButton>
          </Link>
        ) : (
          <>
            <Link to="/">
              <ModalBtn>
                <FontAwesomeIcon icon={faChevronLeft as IconProp} />
              </ModalBtn>
            </Link>
            <Link to="/bridge-initial">
              <BridgeButtonSecondary type="button">What is Onomy Bridge?</BridgeButtonSecondary>
            </Link>
          </>
        )}
        <BridgeWrapper>
          <BridgeBackground>
            <img src={BridgeBackgroundImage} alt="" />
          </BridgeBackground>
          <Success>
            <ImageWrapper>
              <img src={successSrc} alt="" />
            </ImageWrapper>
          </Success>
          <BridgeContentWrapper>
            <BridgeTitle>Assets Bridged Successfully!</BridgeTitle>
            <BridgeText>
              Once NOM is in your wallet, you can start earning rewards by staking! You may manage
              staking at any point in the future, as well
            </BridgeText>
            <Value>
              <Modify>
                + {amountValue}
                <Currency>NOM</Currency>
              </Modify>
              <Slash />– {amountValue}
              <Currency>wNOM</Currency>
            </Value>
            <BridgeInfo>
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
        <ButtonWrapper>
          <Link to="/bridge-welcome">
            <BridgeButtonPrimary type="button">Continue</BridgeButtonPrimary>
          </Link>
        </ButtonWrapper>
      </ModalBody>
    </>
  );
}
