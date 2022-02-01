import React from 'react';
import styled from 'styled-components/macro';

import { Dimmer } from 'components/UI';
import ValidatorHeader from './ValidatorHeader';
import ValidatorFooter from './ValidatorFooter';
import { Hint, TooltipCaption, TooltipDesc } from '../../Sidebar/SidebarStyles';
import { ExternalLink } from '../Icons';

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
`;

const Wrapper = styled.div`
  padding: 32px 40px;

  background-color: ${props => props.theme.colors.bgDarken};
  border-radius: 8px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;

  padding: 32px 0;
  margin-bottom: 40px;

  border-bottom: 1px solid ${props => props.theme.colors.bgHighlightBorder};
`;

const Validator = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ValidatorDesc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  > a {
    display: flex;
    align-items: center;
    gap: 8px;

    font-size: 12px;
    font-weight: 400;
    color: ${props => props.theme.colors.textThirdly};
    text-decoration: none;
  }
`;

const ValidatorName = styled.strong`
  font-family: Bebas Neue, sans-serif;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 2.08px;

  color: ${props => props.theme.colors.textPrimary};
`;

const APR = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  margin-left: auto;

  > span {
    font-size: 12px;
    font-weight: 400;
    color: ${props => props.theme.colors.textThirdly};
  }

  > strong {
    font-family: Bebas Neue, sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: ${props => props.theme.colors.highlightBlue};
  }
`;

const Icon = styled.div`
  margin-left: 150px;
`;

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
      margin-left: 12px;
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

export default function SelectValidator() {
  return (
    <>
      <Dimmer />

      <ModalBody>
        <Wrapper>
          <ValidatorHeader />

          <Header>
            <Validator>
              <img src="https://picsum.photos/80/80" alt="" />
              <ValidatorDesc>
                <ValidatorName>Coinbase Custody</ValidatorName>
                <a href="/">
                  custody.coinbase.com <ExternalLink />
                </a>
              </ValidatorDesc>
            </Validator>
            <APR>
              <span>Estimated APR</span>
              <strong>8.93%</strong>
            </APR>
            <Icon>
              <Hint>
                <TooltipCaption>APR caption</TooltipCaption>
                <TooltipDesc>APR Description</TooltipDesc>
              </Hint>
            </Icon>
          </Header>

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
        </Wrapper>
        <ValidatorFooter />
      </ModalBody>
    </>
  );
}
