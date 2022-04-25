import React, { useState } from 'react';
import styled from 'styled-components/macro';

import { Dimmer } from 'components';
import { Close } from '../Icons';
import * as Modal from '../styles';
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

const RewardRate = styled.div`
  margin-bottom: 12px;

  font-family: Bebas Neue, sans-serif;
  font-size: 80px;
  font-weight: 300;
  letter-spacing: 7.2px;
  text-align: center;
  color: #85c5f9;
`;

const BridgeRewardTitle = styled.div`
  width: 268px;
  margin: 0 auto;

  font-family: Poppins, sans-serif;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  line-height: 2;
  letter-spacing: 3.96px;
  text-align: center;
  color: #ddd8e6;

  opacity: 0.5;
`;

const BridgeButtonSecondary = styled(Modal.SecondaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  width: auto;
  height: 44px;
  padding: 0 24px;
  margin: 24px auto;

  color: ${props => props.theme.colors.txtSecondary};
  white-space: nowrap;

  &:active {
    color: ${props => props.theme.colors.txtPrimary};
  }
`;

const BridgeButtonPrimary = styled(Modal.PrimaryButton)`
  width: auto;
  padding: 0 40px;
`;

const BridgeTitle = styled.div`
  padding-top: 30px;
  margin-bottom: 30px;

  border-top: 1px solid ${props => props.theme.colors.bgHighlight};

  font-family: Barlow, sans-serif;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  color: ${props => props.theme.colors.txtPrimary};
`;

const WnomMaxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 0 40px 0;

  border-bottom: 4px solid #2f2f35;
`;

const Wnom = styled.div`
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
  gap: 20px;

  position: relative;

  font-family: Bebas Neue, sans-serif;
  font-size: 100px;
  color: #fbfbfd;

  span {
    color: #6a6f83;
  }
`;

const ValueDivider = styled.div`
  width: 2px;
  height: 111px;

  position: relative;
  bottom: 7px;

  background-color: ${props => props.theme.colors.white};
`;

const MaxButtom = styled.button`
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

  background-color: ${props => props.theme.colors.bgHighlight};
`;

const BridgeInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  padding-top: 16px;
  margin: 35px 0 0;

  border-top: 1px solid ${props => props.theme.colors.bgHighlight};
`;

const CellStatus = styled.div`
  color: ${props => props.theme.colors.highlightGreen};
`;

const CellData = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  text-align: right;
  font-weight: 500;
`;

const CellChange = styled.div`
  color: #85c5f9;

  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;

  margin: 30px 0;
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
              <BridgeContentWrapper>
                <RewardRate>440%</RewardRate>
                <BridgeRewardTitle>Estimated Annual Staking Reward Rate</BridgeRewardTitle>
                <BridgeButtonSecondary type="button">What is Onomy Bridge?</BridgeButtonSecondary>
                <BridgeTitle>Bridge and stake NOM to earn staking rewards!</BridgeTitle>
                <WnomMaxWrapper>
                  <Wnom>Wnom</Wnom>
                  <Value>
                    0
                    <ValueDivider />
                    <span>.00</span>
                  </Value>
                  <MaxButtom type="button">Max</MaxButtom>
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
                <BridgeInfo>
                  <Row>
                    Bridge Status
                    <CellStatus>Connected</CellStatus>
                  </Row>
                  <Row>
                    Onomy Access Wallet
                    <CellData>
                      0x34923dsj238232189d923189…94c
                      <CellChange>Change</CellChange>
                    </CellData>
                  </Row>
                  <Row>
                    Onomy Access NOM Balance
                    <CellData>1400.00 NOM</CellData>
                  </Row>
                </BridgeInfo>
              </BridgeContentWrapper>
            </BridgeWrapper>
            <ButtonWrapper>
              <BridgeButtonPrimary type="button">Swap wNOM for NOM</BridgeButtonPrimary>
            </ButtonWrapper>
          </ModalBody>
        </>
      )}
    </>
  );
}
