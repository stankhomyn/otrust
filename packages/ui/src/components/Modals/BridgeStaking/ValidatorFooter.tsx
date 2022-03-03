import React from 'react';
import styled from 'styled-components/macro';
import { useBridgedBalanceValue } from '@onomy/react-client';

import { NomBalanceDisplay } from 'components/NomBalanceDisplay';
import { EquivalentValue } from 'components/EquivalentValue';
import { format18 } from 'utils/math';
import { responsive } from 'theme/constants';

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 32px 40px;

  @media screen and (max-width: ${responsive.smartphone}) {
    padding: 20px;
  }
`;

const FooterBalance = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  font-size: 14px;
  color: ${props => props.theme.colors.txtSecondary};
`;

const FooterBalanceValue = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;

  > strong {
    font-size: 28px;
    font-family: Bebas Neue, sans-serif;
    font-weight: 600;
    color: #e1dfeb;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export default function ValidatorFooter({ children }: { children: React.ReactNode }) {
  const nomBalance = useBridgedBalanceValue();

  return (
    <Footer>
      <FooterBalance>
        <p>NOM Balance</p>
        <FooterBalanceValue>
          <strong>
            <NomBalanceDisplay value={nomBalance.toString()} />
          </strong>
          <span>
            <EquivalentValue amount={format18(nomBalance).toNumber()} asset="NOM" />
          </span>
        </FooterBalanceValue>
      </FooterBalance>
      <Controls>{children}</Controls>
    </Footer>
  );
}
