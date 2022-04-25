import React, { useState } from 'react';
import styled from 'styled-components/macro';

import { Dimmer } from 'components';
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
`;

const BridgeWrapper = styled.div`
  padding: 65px 40px 40px;

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

const VideoWrapper = styled.div`
  width: 680px;
  height: 380px;
  margin: 40px auto;

  border: 4px solid ${props => props.theme.colors.bgHighlight};
  border-radius: 4px;
  box-sizing: content-box;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;

  margin: 40px 0;
`;

const BridgeButton = styled(Modal.SecondaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  width: auto;
  height: 50px;
  padding: 0 24px;

  white-space: nowrap;
`;

export default function WelcomeToOnomy() {
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
                <BridgeTitle>Welcome to the Onomy Network! </BridgeTitle>
                <BridgeText>
                  Together, we will build the decentralized reserve bank and facilitate Forex
                  volumes on-chain. Learn more by watching our animated film!
                </BridgeText>
                <VideoWrapper>
                  <img src="https://picsum.photos/680/380" alt="" />
                </VideoWrapper>
                <BridgeText>
                  Once NOM is in your wallet, you can start earning rewards by staking! You may
                  manage staking at any point in the future, as well.
                </BridgeText>
              </BridgeContentWrapper>
            </BridgeWrapper>
            <ButtonWrapper>
              <Modal.PrimaryButton type="button">Start staking</Modal.PrimaryButton>
              <BridgeButton type="button">Done</BridgeButton>
            </ButtonWrapper>
          </ModalBody>
        </>
      )}
    </>
  );
}
