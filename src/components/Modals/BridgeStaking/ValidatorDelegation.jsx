import React from 'react';
import styled from 'styled-components/macro';

import { Dimmer } from 'components/UI';
import ValidatorFooter from './ValidatorFooter';
import { Hint, TooltipCaption, TooltipDesc } from '../../Sidebar/SidebarStyles';
import { ExternalLink } from '../Icons';
import { Caption, Desc } from './ValidatorHeader';
import { Sending, ExchangeInput, MaxBtn, SendingBox } from '../../Exchange/exchangeStyles';

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

export default function ValidatorDelegation() {
  return (
    <>
      <Dimmer />

      <ModalBody>
        <Wrapper>
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

          <div>
            <Caption>Delegate NOMs</Caption>
            <Desc>
              Now you can delegate part of your NOMs to the desired validator. After that this part
              will be locked inside validator node, and you will start to receive yield
            </Desc>
            <Sending>
              <strong>Delegate NOMs</strong>
              <ExchangeInput
                type="text"
                name="WNOMValue"
                onChange={() => {}}
                value={123}
                placeholder="0.00"
                autoComplete="off"
              />
              <SendingBox>
                <strong style={{ marginLeft: '16px' }}>NOM</strong>
                <MaxBtn name="ETHValue">Max</MaxBtn>
              </SendingBox>
            </Sending>
          </div>
        </Wrapper>
        <ValidatorFooter />
      </ModalBody>
    </>
  );
}
