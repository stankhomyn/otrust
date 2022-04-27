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

    background-color: #0a090e;
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
    padding: 50px 40px 25px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    padding: 80px 20px 0;

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

const VideoWrapper = styled.div`
  width: 100%;
  margin: 40px auto;

  border: 4px solid ${props => props.theme.colors.bgHighlight};
  border-radius: 4px;
  box-sizing: content-box;

  img {
    width: 100%;
    display: block;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin: 28px 0;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;

  margin: 40px 0;

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    justify-content: space-between;

    padding: 0 20px;
    margin: 190px 0 40px;
  }
`;

const BridgeButtonPrimary = styled(Modal.PrimaryButton)`
  width: auto;
  padding: 0 40px;

  white-space: nowrap;

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    height: auto;
    padding: 16px 40px;
  }
`;

const BridgeButton = styled(Modal.SecondaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  width: auto;
  padding: 0 24px;

  white-space: nowrap;

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    height: auto;
    padding: 16px 40px;
  }
`;

export default function WelcomeToOnomy() {
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
                <BridgeTitle>Welcome to the Onomy Network! </BridgeTitle>
                <BridgeText>
                  Together, we will build the decentralized reserve bank and facilitate Forex
                  volumes on-chain. Learn more by watching our animated film!
                </BridgeText>
                <VideoWrapper>
                  <img src="https://picsum.photos/680/390" alt="" />
                </VideoWrapper>
                <BridgeText>
                  Once NOM is in your wallet, you can start earning rewards by staking! You may
                  manage staking at any point in the future, as well.
                </BridgeText>
              </BridgeContentWrapper>
            </BridgeWrapper>
            <ButtonWrapper>
              <BridgeButtonPrimary type="button">Start staking</BridgeButtonPrimary>
              <BridgeButton type="button">Done</BridgeButton>
            </ButtonWrapper>
          </ModalBody>
        </>
      )}
    </>
  );
}
