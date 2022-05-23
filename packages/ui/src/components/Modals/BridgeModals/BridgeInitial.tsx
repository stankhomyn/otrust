import React from 'react';
import { Link } from 'react-router-dom';
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
import WarningIcon from '../assets/warning.svg';

const ModalBody = styled.div`
  width: 775px;
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
  padding: 92px 40px 35px;

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

  @media screen and (max-width: ${responsive.tablet}) {
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
  margin-top: 30px;

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

const BridgeNote = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  padding: 11px;
  margin: 35px 0 50px;

  background-color: rgba(136, 209, 255, 0.1);
  border-radius: 4px;

  font-size: 14px;
  color: rgba(136, 209, 255, 0.8);

  @media screen and (max-width: ${responsive.tabletSmall}) {
    padding: 8px 16px;
    margin: 24px 0;

    font-size: 12px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    align-items: start;

    padding: 8px 10px;
  }
`;

const BridgeNoteIconeWrapper = styled.div`
  width: 32px;
  height: 32px;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    display: flex;

    width: 24px;
    height: 24px;
  }
`;

const BridgeList = styled.ul`
  margin-top: 24px;

  list-style-type: none;

  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};

  li {
    display: flex;
    align-items: center;

    padding: 23px 0;
    margin: 0;

    border-bottom: 1px solid ${props => props.theme.colors.bgHighlight};

    &:last-child {
      border: none;
    }
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 14px;

    li {
      padding: 19px;
    }
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    margin: 0;

    font-size: 12px;

    li {
      padding: 19px 0;

      align-items: start;
    }
  }
`;

const ListCount = styled.span`
  display: inline-flex;
  justify-content: center;

  width: 10px;
  margin-right: 30px;

  color: ${props => props.theme.colors.txtThirdly};
`;

const DashedText = styled.span`
  padding-bottom: 3px;

  border-bottom: 1px dashed ${props => props.theme.colors.textPrimary};

  color: ${props => props.theme.colors.textPrimary};
  font-weight: 300;

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    padding-bottom: 0;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;

  margin: 40px 0;

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    a {
      display: flex;
      justify-content: center;

      width: 100%;

      text-decoration: none;
    }

    ${Modal.PrimaryButton} {
      width: 90%;
    }
  }
`;

const ButtomPrimary = styled(Modal.PrimaryButton)`
  width: auto;
  height: auto;
  padding: 17px 42px;

  font-size: 14px;
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
            <BridgeTitle>What is Onomy Bridge?</BridgeTitle>
            <BridgeText>
              With Onomy Bridge you can move your wNOMs from Bonding Curve to Onomy Blockchain, so
              you get real NOMs. Choose to bridge when you are ready to do so to finalize your
              purchase of NOM!
            </BridgeText>
            <BridgeNote>
              <BridgeNoteIconeWrapper>
                <img src={WarningIcon} alt="" />
              </BridgeNoteIconeWrapper>
              <p>
                NOTE: After bridging, you can no longer sell back to the bonding curve or bridge
                back for wNOM. There are no guarantees of liquid markets
              </p>
            </BridgeNote>
            <BridgeTitle>Why should I bridge?</BridgeTitle>
            <BridgeList>
              <li>
                <ListCount>1</ListCount>
                <span>You must hold NOM to participate in the Onomy Network</span>
              </li>
              <li>
                <ListCount>2</ListCount>
                <span>
                  Early stakers of NOM take advantage of{' '}
                  <DashedText>larger staking yield</DashedText>
                </span>
              </li>
              <li>
                <ListCount>3</ListCount>
                <span>
                  NOM is used for <DashedText>governance, staking, and collateral</DashedText> to
                  mint stablecoins
                </span>
              </li>
              <li>
                <ListCount>4</ListCount>All bridged wNOM is burned from the bonding curve supply
              </li>
              <li>
                <ListCount>5</ListCount>
                <span>
                  NOM would be <DashedText>listed on exchanges</DashedText> rather than wNOM
                </span>
              </li>
            </BridgeList>
          </BridgeContentWrapper>
        </BridgeWrapper>
        <ButtonWrapper>
          <Link to="/bridge-wallets">
            <ButtomPrimary type="button">Get Started!</ButtomPrimary>
          </Link>
        </ButtonWrapper>
      </ModalBody>
    </>
  );
}
