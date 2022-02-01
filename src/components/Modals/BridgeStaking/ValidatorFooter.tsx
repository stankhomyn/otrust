import React from 'react';
import styled from 'styled-components/macro';

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 32px 40px;
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
  return (
    <Footer>
      <FooterBalance>
        <p>NOM Balance</p>
        <FooterBalanceValue>
          <strong>23.20931</strong>
          <span> = $16,208.04</span>
        </FooterBalanceValue>
      </FooterBalance>
      <Controls>{children}</Controls>
    </Footer>
  );
}
