import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useMediaQuery } from 'react-responsive';

import { Dimmer } from 'components';
import { responsive } from 'theme/constants';
import { Close } from '../Icons';
import * as Modal from '../styles';
import BridgeBackgroundImage from '../assets/bridge-top-light-bg.svg';
import { ReactComponent as CircleSpinner } from '../assets/circle-spinner.svg';

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

const rotate = keyframes`
  0% { 
    transform: rotate(0deg); 
  }
  100% { 
    transform: rotate(270deg); 
  }
`;

const dash = keyframes`
  0% { 
    stroke-dashoffset: 200; 
  }
  50% {
    stroke-dashoffset: 50;
    transform:rotate(135deg);
  }
  100% {
    stroke-dashoffset: 200;
    transform:rotate(450deg);
  }
`;

const Spinner = styled(CircleSpinner)`
  display: block;

  width: 140px;
  height: 140px;
  margin: auto;

  border-radius: 50%;
  box-shadow: inset 0 0 0 4px rgba(133, 197, 249, 0.1);
  stroke: #85c5f9;
  stroke-width: 2;

  animation: ${rotate} 2s linear infinite;

  circle {
    stroke-dasharray: 200;
    transform-origin: center;

    animation: ${dash} 2s ease-in-out infinite;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    width: 110px;
    height: 110px;
  }
`;

const BridgeContentWrapper = styled.div`
  position: inherit;
`;

const BridgeTitle = styled.div`
  margin: 80px 0 16px;

  font-family: Barlow, sans-serif;
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

export default function BridgePanding() {
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
              <Spinner />
              <BridgeContentWrapper>
                <BridgeTitle>Bridging assets… 7 minutes left</BridgeTitle>
                <BridgeText>
                  Once NOM is in your wallet, you can start earning rewards by staking! You may
                  manage staking at any point in the future, as well
                </BridgeText>
                <Value>
                  <Modify>
                    + 544.24
                    <Currency>NOM</Currency>
                  </Modify>
                  <Slash />– 544.24
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
                      1954.24 NOM
                    </CellData>
                  </Row>
                  <Row>
                    New wNOM balance
                    <CellData>
                      <CrossData>2044.24 wNOM</CrossData>
                      1500.00 wNOM
                    </CellData>
                  </Row>
                </BridgeInfo>
              </BridgeContentWrapper>
            </BridgeWrapper>
          </ModalBody>
        </>
      )}
    </>
  );
}
