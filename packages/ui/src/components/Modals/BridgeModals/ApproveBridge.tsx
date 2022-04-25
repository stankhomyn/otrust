import React, { useState } from 'react';
import styled from 'styled-components/macro';

import { Dimmer } from 'components';
import { Close } from '../Icons';
import * as Modal from '../styles';
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

const BridgeButtonPrimary = styled(Modal.PrimaryButton)`
  width: auto;
  padding: 0 40px;
`;

const BridgeTitle = styled.div`
  margin: 110px 0 50px;

  font-family: Barlow, sans-serif;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  color: #e1dfeb;
`;

const WnomMaxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 0 40px 0;

  border-bottom: 4px solid #2f2f35;
`;

const Wnom = styled.div`
  width: 90px;

  font-family: Bebas Neue, sans-serif;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: #fbfbfd;
`;

const Value = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  font-family: Bebas Neue, sans-serif;
  font-size: 100px;
  color: #fbfbfd;

  span {
    color: #6a6f83;
  }
`;

const ChangeButtom = styled.button`
  padding: 12px 13px 8px 16px;

  border-radius: 26px;
  border: none;
  background-color: ${props => props.theme.colors.bgHighlight};

  font-family: Bebas Neue, sans-serif;
  font-size: 20px;
  font-weight: bold;
  line-height: 0.8;
  letter-spacing: 2.4px;
  color: #85c5f9;
`;

const TotalApprovedWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: 16px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 15px;

  width: 100%;

  color: #6a6f83;

  span {
    font-weight: 500;
    color: #fbfbfd;
  }
`;

const CellDivider = styled.div`
  width: 2px;
  height: 21px;
  margin: 0 20px;

  background: ${props => props.theme.colors.bgHighlight};
`;

const TextWrapper = styled.div`
  margin-top: 45px;

  font-size: 16px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const TextModify = styled.span`
  color: #85c5f9;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;

  margin: 30px 0;
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

export default function BridgeNOM() {
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
              <Warning>
                <ImageWrapper>
                  <img src={WarningIcon} alt="" />
                </ImageWrapper>
              </Warning>
              <BridgeContentWrapper>
                <BridgeTitle>Approve additional wNOM for bridging</BridgeTitle>
                <WnomMaxWrapper>
                  <Wnom>Wnom</Wnom>
                  <Value>
                    600
                    <span>.00</span>
                  </Value>
                  <ChangeButtom type="button">Change</ChangeButtom>
                </WnomMaxWrapper>
                <TotalApprovedWrapper>
                  <Row>
                    Total wNOM Balance
                    <span>30 329 wNOM</span>
                  </Row>
                  <CellDivider />
                  <Row>
                    Approved wNOM
                    <span>30 329 wNOM</span>
                  </Row>
                </TotalApprovedWrapper>
                <TextWrapper>
                  You want to sell <TextModify>1600 wNOM</TextModify>, but you approved for sale
                  only <TextModify>1000 wNOM</TextModify>. Would you like to approve the rest{' '}
                  <TextModify>600 wNOM</TextModify> and complete selling?
                </TextWrapper>
              </BridgeContentWrapper>
            </BridgeWrapper>
            <ButtonWrapper>
              <BridgeButton type="button">Back</BridgeButton>
              <BridgeButtonPrimary type="button">Approve & Bridge</BridgeButtonPrimary>
            </ButtonWrapper>
          </ModalBody>
        </>
      )}
    </>
  );
}
