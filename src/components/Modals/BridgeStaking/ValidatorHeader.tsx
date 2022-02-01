import React from 'react';
import styled from 'styled-components/macro';

const Caption = styled.h3`
  margin-bottom: 20px;

  font-family: Barlow Condensed, sans-serif;
  font-size: 28px;
  font-weight: 500;
  color: ${props => props.theme.colors.txtPrimary};
`;

const Desc = styled.p`
  margin-bottom: 24px;

  font-size: 14px;
  line-height: 20px;
  color: ${props => props.theme.colors.txtSecondary};
`;

export default function ValidatorHeader() {
  return (
    <header>
      <Caption>Select validator node</Caption>
      <Desc>
        As you gonna stake your NOMs, you need to select a validator for it. Please chose on of the
        list of available validator nodes
      </Desc>
    </header>
  );
}
