import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useMediaQuery } from 'react-responsive';

import { Dimmer } from 'components';
import { responsive } from 'theme/constants';
import { Close } from '../Icons';
import * as Modal from '../styles';
import BridgeBackgroundImage from '../assets/bridge-top-bg.svg';
import MainMenuIcon from '../assets/ico-main-menu.svg';
import QrCodeIcon from '../assets/ico-qr.svg';
import QrCode from '../assets/QR-code-obituary.svg';
import AppleIcon from '../assets/icon-apple.svg';
import GooglrPlayIcon from '../assets/icon-google-play.svg';

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
  padding: 65px 40px 40px;

  position: relative;

  background-color: ${props => props.theme.colors.bgDarken};
  border-radius: 4px;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    padding: 50px 20px 25px;
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
  margin-top: 32px;

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

const DirectoryQR = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  padding: 12px 0;
  margin: 30px 0 40px;

  background-color: ${props => props.theme.colors.bgNormal};
  border-radius: 4px;

  @media screen and (max-width: ${responsive.smartphone}) {
    gap: 8px;
  }
`;

const Slash = styled.div`
  width: 2px;
  height: 25px;
  margin: 0 5px;

  background-color: #656273;
  transform: rotate(30deg);
`;

const Reflection = styled.div`
  width: 291px;
  height: 372px;
  margin: 0 auto 32px;

  position: relative;

  background-image: url(${QrCode});
  background-repeat: no-repeat;

  &:before {
    content: '';

    width: inherit;
    height: 80px;

    position: absolute;
    bottom: 0;

    background: linear-gradient(
      to bottom,
      rgba(26, 23, 35, 0) 0%,
      ${props => props.theme.colors.bgDarken} 100%
    );

    z-index: 1;
  }

  &:after {
    content: '';

    width: inherit;
    height: 83px;

    position: absolute;
    bottom: 5px;

    background-image: inherit;
    background-position: 0px 78px;
    opacity: 0.1;

    transform: scaleY(-1);
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    width: 240px;
    height: 323px;
    margin: 0 auto 16px;

    background-size: 240px;

    &:after {
      background-size: inherit;
    }
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    &:before {
      background-image: linear-gradient(to bottom, rgba(10, 9, 14, 0), #0a090e);
    }
  }
`;

const BridgeFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;

  padding: 40px 0 0;

  border-top: 1px solid ${props => props.theme.colors.bgHighlight};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    padding: 30px 0 0;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    flex-direction: column;
  }
`;

const BridgeFooterText = styled.div`
  font-family: Poppins, sans-serif;
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 13px;
    text-align: left;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 17px;

  @media screen and (max-width: ${responsive.smartphone}) {
    justify-content: space-between;

    width: 100%;
  }
`;

const BridgeButtonSecondary = styled(Modal.SecondaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  width: auto;
  padding: 0 24px;

  white-space: nowrap;
`;

export default function WhatIsBridge() {
  const [isOpen, setIsOpen] = useState(true);
  const BreakpointSmartphoneLarge = useMediaQuery({ minWidth: responsive.smartphoneLarge });

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <>
          <Dimmer />
          <ModalBody>
            {BreakpointSmartphoneLarge ? (
              <Modal.CloseIcon onClick={closeModal}>
                <Close />
              </Modal.CloseIcon>
            ) : (
              <ModalBtn onClick={closeModal}>
                <FontAwesomeIcon icon={faChevronLeft as IconProp} />
              </ModalBtn>
            )}
            <BridgeWrapper>
              <BridgeBackground>
                <img src={BridgeBackgroundImage} alt="" />
              </BridgeBackground>
              <BridgeContentWrapper>
                <BridgeTitle>Connect Onomy Access</BridgeTitle>
                <BridgeText>
                  Welcome to Onomy Bridge! Right now you need to connect your Onomy Access wallet to
                  be able to bridge assets from Bonding Curve. Please scan this QR code with your
                  Onomy Access app
                </BridgeText>
                <DirectoryQR>
                  <img src={MainMenuIcon} alt="" />
                  Main menu
                  <Slash />
                  <img src={QrCodeIcon} alt="" />
                  Desktop Sign in (QR)
                </DirectoryQR>
                <Reflection />
                <BridgeFooter>
                  <BridgeFooterText>
                    If you don’t have Onomy Access – you can download it from your mobile phone
                  </BridgeFooterText>
                  <ButtonWrapper>
                    <BridgeButtonSecondary>
                      <img src={AppleIcon} alt="" />
                      App Store
                    </BridgeButtonSecondary>
                    <BridgeButtonSecondary>
                      <img src={GooglrPlayIcon} alt="" />
                      Play Market
                    </BridgeButtonSecondary>
                  </ButtonWrapper>
                </BridgeFooter>
              </BridgeContentWrapper>
            </BridgeWrapper>
          </ModalBody>
        </>
      )}
    </>
  );
}
