import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useMediaQuery } from 'react-responsive';

import { Dimmer } from 'components';
import { responsive } from 'theme/constants';
import { Close } from '../Icons';
import * as Modal from '../styles';
import BridgeBackgroundImage from '../assets/bridge-top-bg.svg';
import OnomyBigImage from '../assets/onomy-big.svg';
import OnomyIcon from '../assets/onomy-icon.svg';
import KeplrBigImage from '../assets/keplr-big.svg';
import KeplrIcon from '../assets/keplr-icon.svg';
import CosmostationBigImage from '../assets/cosmostation-big.svg';
import CosmostationIcon from '../assets/cosmostation-icon.svg';

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

const BridgeWrapper = styled.div`
  padding: 90px 40px 170px;

  position: relative;

  background-color: ${props => props.theme.colors.bgDarken};
  border-radius: 4px;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    padding: 50px 20px 65px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    padding: 80px 20px 32px;

    background-color: #0a090e;
    border-radius: 0;
  }
`;

const BridgeBackground = styled.div`
  position: absolute;
  top: -22px;
  left: 50%;

  transform: translateX(-50%);

  @media screen and (max-width: ${responsive.tabletSmall}) {
    width: 627px;

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

const BridgeTitle = styled.div`
  font-family: Barlow Condensed, sans-serif;
  text-align: center;
  font-size: 28px;
  font-weight: 500;
  color: ${props => props.theme.colors.txtPrimary};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 24px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    text-align: left;
  }
`;

const BridgeText = styled.p`
  margin: 32px 0 85px;

  font-size: 16px;
  text-align: center;
  color: ${props => props.theme.colors.txtSecondary};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin-top: 16px;

    font-size: 12px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    text-align: left;
  }
`;

const BridgeWalletsWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: ${responsive.smartphone}) {
    flex-direction: column;
    gap: 20px;
  }
`;

const WalletButton = styled.button`
  padding: 10px 5px 40px;

  position: relative;

  border: none;
  outline: none;
  background-color: #302e3d;
  border-radius: 8px;

  font-family: Barlow Condensed, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #f4f4fe;

  @media screen and (max-width: ${responsive.smartphone}) {
    display: flex;
    align-items: center;

    width: 100%;
    padding: 20px;

    position: relative;

    overflow: hidden;

    span {
      padding-left: 20px;

      position: relative;

      z-index: 10;
    }
  }
`;

const WalletBigIcon = styled.div`
  margin: 0 0 -30px;

  @media screen and (max-width: ${responsive.smartphone}) {
    position: absolute;
    right: 0;
    top: -25px;
  }
`;

const WalletIcon = styled.div`
  margin-bottom: 20px;

  @media screen and (max-width: ${responsive.smartphone}) {
    margin: 0;
  }
`;

const ChevronRight = styled(FontAwesomeIcon)`
  display: none;

  position: relative;
  top: 3px;

  z-index: 1;

  @media screen and (max-width: ${responsive.smartphone}) {
    display: block;
    margin-left: auto;

    color: #84809a;
  }
`;

export default function WhatIsBridge() {
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
          <Link to="/">
            <ModalBtn>
              <FontAwesomeIcon icon={faChevronLeft as IconProp} />
            </ModalBtn>
          </Link>
        )}
        <BridgeWrapper>
          <BridgeBackground>
            <img src={BridgeBackgroundImage} alt="" />
          </BridgeBackground>
          <BridgeContentWrapper>
            <BridgeTitle>Select your wallet type</BridgeTitle>
            <BridgeText>
              You can bridge your wNOMs to NOMs using any of these wallets. Please select one you’d
              like to connect and bridge to
            </BridgeText>
            <BridgeWalletsWrapper>
              <Link to="/bridge-connect-onomy">
                <WalletButton>
                  <WalletBigIcon>
                    <img src={OnomyBigImage} alt="" />
                  </WalletBigIcon>
                  <WalletIcon>
                    <img src={OnomyIcon} alt="" />
                  </WalletIcon>
                  <span>Onomy Access</span>
                  <ChevronRight icon={faChevronRight as IconProp} />
                </WalletButton>
              </Link>
              <Link to="/">
                <WalletButton>
                  <WalletBigIcon>
                    <img src={KeplrBigImage} alt="" />
                  </WalletBigIcon>
                  <WalletIcon>
                    <img src={KeplrIcon} alt="" />
                  </WalletIcon>
                  <span>Keplr</span>
                  <ChevronRight icon={faChevronRight as IconProp} />
                </WalletButton>
              </Link>
              <Link to="/">
                <WalletButton>
                  <WalletBigIcon>
                    <img src={CosmostationBigImage} alt="" />
                  </WalletBigIcon>
                  <WalletIcon>
                    <img src={CosmostationIcon} alt="" />
                  </WalletIcon>
                  <span>Cosmostation</span>
                  <ChevronRight icon={faChevronRight as IconProp} />
                </WalletButton>
              </Link>
            </BridgeWalletsWrapper>
          </BridgeContentWrapper>
        </BridgeWrapper>
      </ModalBody>
    </>
  );
}
