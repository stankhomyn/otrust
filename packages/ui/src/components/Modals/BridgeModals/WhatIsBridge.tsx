import React, { useState } from 'react';
import styled from 'styled-components/macro';

import { Dimmer } from 'components';
import { Close } from '../Icons';
import * as Modal from '../styles';
import BridgeBackgroundImage from '../assets/bridge-top-bg.svg';
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

  ${Modal.CloseIcon} {
    z-index: 1;
  }
`;

const BridgeWrapper = styled.div`
  padding: 65px 40px 25px;

  position: relative;

  background-color: ${props => props.theme.colors.bgDarken};
  border-radius: 4px;
`;

const BridgeBackground = styled.div`
  position: absolute;
  top: -22px;
  left: 50%;

  transform: translateX(-50%);
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
`;

const BridgeText = styled.p`
  margin-top: 32px;

  font-size: 16px;
  text-align: center;
  color: ${props => props.theme.colors.txtSecondary};
`;

const BridgeNote = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  padding: 11px;
  margin: 35px 0;

  background-color: rgba(136, 209, 255, 0.1);
  border-radius: 4px;

  font-size: 14px;
  color: rgba(136, 209, 255, 0.8);
`;

const BridgeNoteIconeWrapper = styled.div`
  width: 32px;
  height: 32px;
`;

const BridgeList = styled.ul`
  margin-top: 20px;

  list-style-type: none;

  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};

  li {
    padding: 24px 0;
    margin: 0;

    border-bottom: 1px solid ${props => props.theme.colors.bgHighlight};

    &:last-child {
      border: none;
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

  color: ${props => props.theme.colors.textPrimary};

  border-bottom-style: dashed;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;

  margin: 25px 0;
`;

export default function WhatIsBridge() {
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <>
          <Dimmer />
          <ModalBody>
            <Modal.CloseIcon onClick={closeModal}>
              <Close />
            </Modal.CloseIcon>
            <BridgeWrapper>
              <BridgeBackground>
                <img src={BridgeBackgroundImage} alt="" />
              </BridgeBackground>
              <BridgeContentWrapper>
                <BridgeTitle>What is Onomy Bridge?</BridgeTitle>
                <BridgeText>
                  With Onomy Bridge you can move your wNOMs from Bonding Curve to Onomy Blockchain,
                  so you get real NOMs. Choose to bridge when you are ready to do so to finalize
                  your purchase of NOM!{' '}
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
                    <ListCount>1</ListCount>You must hold NOM to participate in the Onomy Network
                  </li>
                  <li>
                    <ListCount>2</ListCount>
                    Early stakers of NOM take advantage of{' '}
                    <DashedText>larger staking yield</DashedText>
                  </li>
                  <li>
                    <ListCount>3</ListCount>
                    NOM is used for <DashedText>governance, staking, and collateral</DashedText> to
                    mint stablecoins
                  </li>
                  <li>
                    <ListCount>4</ListCount>All bridged wNOM is burned from the bonding curve supply
                  </li>
                  <li>
                    <ListCount>5</ListCount>
                    NOM would be <DashedText>listed on exchanges</DashedText> rather than wNOM
                  </li>
                </BridgeList>
              </BridgeContentWrapper>
            </BridgeWrapper>
            <ButtonWrapper>
              <Modal.PrimaryButton type="button">Get Started!</Modal.PrimaryButton>
            </ButtonWrapper>
          </ModalBody>
        </>
      )}
    </>
  );
}
