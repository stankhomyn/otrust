import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

import ValidatorHeader from './ValidatorHeader';
import ValidatorFooter from './ValidatorFooter';
import ValidatorNodeHeader from './ValidatorNodeHeader';
import * as Modal from '../styles';
import BackButton from './BackButton';
import StakingModal from './StakingModal';

const DelegateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DelegateItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  width: 50%;

  & + & {
    padding-left: 55px;

    border-left: 1px solid ${props => props.theme.colors.bgHighlightBorder};
  }

  > span {
    font-size: 14px;
    font-weight: 500;
    color: #9595a6;
  }

  > strong {
    margin-top: 16px;

    font-family: Bebas Neue, sans-serif;
    font-size: 40px;
    font-weight: 600;
    color: ${props =>
      props.reward ? props.theme.colors.highlightBlue : props.theme.colors.textPrimary};

    > sup {
      margin-left: 6px;
      font-size: 18px;
    }
  }
`;

const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  gap: 24px 100px;

  padding: 32px 0;
  margin-top: 40px;

  border-top: 1px solid ${props => props.theme.colors.bgHighlightBorder};
`;

const FooterInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: calc(50% - 50px);

  > span {
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.theme.colors.textThirdly};
  }

  > strong {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.textPrimary};
  }
`;

export default function ValidatorNode() {
  return (
    <StakingModal>
      <Modal.StakingWrapper>
        <BackButton
          clickHandler={() => {
            alert('going back');
          }}
        />
        <ValidatorHeader />

        <ValidatorNodeHeader />

        <DelegateWrapper>
          <DelegateItem>
            <span>Delegated</span>
            <strong>
              22,094.23 <sup>NOM</sup>
            </strong>
            <span>$3,998.32</span>
          </DelegateItem>
          <DelegateItem reward>
            <span>Reward</span>
            <strong>
              4,552.98 <sup>XRP</sup>
            </strong>
            <span>$3,998.32</span>
          </DelegateItem>
        </DelegateWrapper>

        <Footer>
          <FooterInfo>
            <span>Total Banded</span>
            <strong>10,682,107 XRP</strong>
          </FooterInfo>
          <FooterInfo>
            <span>Self Bonded Rate</span>
            <strong>0.92%</strong>
          </FooterInfo>
          <FooterInfo>
            <span>Commission</span>
            <strong>8.90%</strong>
          </FooterInfo>
          <FooterInfo>
            <span>Voting Power</span>
            <strong>13.9M</strong>
          </FooterInfo>
        </Footer>
      </Modal.StakingWrapper>
      <ValidatorFooter>
        <Modal.SecondaryButton type="button">Undelegate</Modal.SecondaryButton>
        <Link to="/validator-delegation">
          <Modal.PrimaryButton type="button">Delegate</Modal.PrimaryButton>
        </Link>{' '}
      </ValidatorFooter>
    </StakingModal>
  );
}
