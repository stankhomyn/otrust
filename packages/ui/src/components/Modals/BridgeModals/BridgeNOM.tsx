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
  padding: 65px 40px 25px;

  position: relative;

  background-color: ${props => props.theme.colors.bgDarken};
  border-radius: 4px;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    padding: 28px 20px 25px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    padding: 7px 20px 25px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    padding: 10px 20px 32px;

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

const HeaderWrapper = styled.div`
  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: flex;
    flex-direction: column-reverse;
    gap: 32px;

    padding-bottom: 5px;
  }
`;

const RewardWrapper = styled.div`
  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    gap: 10px;
  }
`;

const RewardRate = styled.div`
  margin-bottom: 12px;

  font-family: Bebas Neue, sans-serif;
  font-size: 80px;
  font-weight: 300;
  letter-spacing: 7.2px;
  text-align: center;
  color: #85c5f9;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin-bottom: 0;

    font-size: 64px;
  }
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

  @media screen and (max-width: ${responsive.tabletSmall}) {
    letter-spacing: 1.44px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    margin: 0;

    text-align: left;
  }
`;

const BridgeButtonSecondary = styled(Modal.SecondaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  width: auto;
  padding: 0 24px;
  margin: 24px auto;

  color: ${props => props.theme.colors.txtSecondary};
  white-space: nowrap;

  &:active {
    color: ${props => props.theme.colors.txtPrimary};
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin: 8px auto 16px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    align-self: end;

    height: 44px;
    margin: 0;
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

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 20px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    text-align: left;
  }
`;

const WnomMaxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 0 40px 0;

  border-bottom: 4px solid #2f2f35;

  @media screen and (max-width: ${responsive.smartphone}) {
    padding-bottom: 18px;
  }
`;

const Wnom = styled.div`
  font-family: Bebas Neue, sans-serif;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: #fbfbfd;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 16px;
  }

  @media screen and (max-width: ${responsive.smartphone}) {
    margin-right: 16px;
  }
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

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 72px;
  }
`;

const ValueDivider = styled.div`
  width: 2px;
  height: 111px;

  position: relative;
  bottom: 7px;

  background-color: #ffffff;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    height: 81px;
  }
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

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 16px;
    letter-spacing: 1.92px;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    font-size: 16px;
    padding: 12px 13px 8px 14px;
  }

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    margin-left: auto;
  }
`;

const TotalApprovedWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: 16px;

  @media screen and (max-width: ${responsive.tabletSmall}) {
    gap: 40px;

    font-size: 12px;
  }
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
    text-align: right;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    gap: 0;
  }
`;

const CellDivider = styled.div`
  width: 2px;
  height: 21px;
  margin: 0 20px;

  background-color: ${props => props.theme.colors.bgHighlight};

  @media screen and (max-width: ${responsive.smartphone}) {
    display: none;
  }
`;

const BridgeInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  padding-top: 16px;
  margin: 35px 0 0;

  border-top: 1px solid ${props => props.theme.colors.bgHighlight};

  @media screen and (max-width: ${responsive.tabletSmall}) {
    margin-top: 120px;

    font-size: 12px;
  }
`;

const CellStatus = styled.div`
  color: ${props => props.theme.colors.highlightGreen};
`;

const CellData = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  text-align: right;
  font-weight: 500;
  white-space: nowrap;
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

  @media screen and (max-width: ${responsive.smartphoneSmall}) {
    ${Modal.PrimaryButton} {
      width: 90%;
    }
  }
`;

export default function BridgeNOM() {
  const [isOpen, setIsOpen] = useState(true);
  const BreakpointSmartphoneLarge = useMediaQuery({ minWidth: responsive.smartphoneLarge });
  const BreakpointSmartphone = useMediaQuery({ minWidth: responsive.smartphone });

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
                <HeaderWrapper>
                  <RewardWrapper>
                    <RewardRate>440%</RewardRate>
                    <BridgeRewardTitle>Estimated Annual Staking Reward Rate</BridgeRewardTitle>
                  </RewardWrapper>
                  <BridgeButtonSecondary type="button">What is Onomy Bridge?</BridgeButtonSecondary>
                </HeaderWrapper>
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
                    {BreakpointSmartphone ? 'Total wNOM Balance' : 'Balance'}
                    <span>30 329 wNOM</span>
                  </Row>
                  <CellDivider />
                  <Row>
                    {BreakpointSmartphone ? 'Approved  wNOM' : 'Approved'}
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
