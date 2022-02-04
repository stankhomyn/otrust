import React from 'react';
import styled from 'styled-components/macro';

import { Hint, TooltipCaption, TooltipDesc } from '../../Sidebar/SidebarStyles';
import { ExternalLink } from '../Icons';

const Header = styled.header`
  display: flex;
  align-items: center;

  padding: 0 0 32px;
  margin-bottom: 40px;

  border-bottom: 1px solid ${props => props.theme.colors.bgHighlightBorder};
`;

const Validator = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  img {
    border-radius: 4px;
  }
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

    > sup {
      margin-left: 4px;
      font-size: 12px;
    }
  }
`;

const Icon = styled.div`
  margin-left: 150px;
`;

export default function ValidatorNodeHeader() {
  return (
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
        <strong>
          8.93<sup>%</sup>
        </strong>
      </APR>
      <Icon>
        <Hint>
          <TooltipCaption>APR caption</TooltipCaption>
          <TooltipDesc>APR Description</TooltipDesc>
        </Hint>
      </Icon>
    </Header>
  );
}
