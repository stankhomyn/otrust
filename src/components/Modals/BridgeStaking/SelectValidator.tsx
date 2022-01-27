import React from 'react';
import styled from 'styled-components/macro';

import { Dimmer } from 'components/UI';
import * as Modal from '../styles';

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

interface Validator {
  id: string;
  name: string;
  img?: string;
  votingPower: string;
  APR: number;
  delegated: {
    value: number;
    change: number;
    changeType?: 'UP' | 'DOWN';
  };
}

const sampleData: Validator[] = [
  {
    id: '1',
    name: 'CoinBase Custody',
    votingPower: '13,9M',
    APR: 3.54,
    delegated: {
      value: 23095.22,
      change: 4552.98,
      changeType: 'UP',
    },
  },
  {
    id: '2',
    name: 'Binance Staking',
    votingPower: '15,9M',
    APR: 9.54,
    delegated: {
      value: 1231.22,
      change: 22.98,
      changeType: 'DOWN',
    },
  },
  {
    id: '3',
    name: 'CoinBase Custody',
    votingPower: '13,9M',
    APR: 3.54,
    delegated: {
      value: 11111.22,
      change: 0,
    },
  },
];

export default function SelectValidator() {
  return (
    <>
      <Dimmer />

      <ModalBody>
        <Wrapper>
          <header>
            <Caption>Assets Bridged Successfully!</Caption>
            <Desc>
              As you gonna stake your NOMs, you need to select a validator for it. Please chose on
              of the list of available validator nodes
            </Desc>
          </header>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>APR</th>
                <th>Delegated</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((validator: Validator) => (
                <tr key={validator.id}>
                  <td>
                    {validator.name} {validator.votingPower}
                  </td>
                  <td>{validator.APR}</td>
                  <td>
                    {validator.delegated.value} {validator.delegated.changeType}{' '}
                    {validator.delegated.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Wrapper>
        <Footer>
          <FooterBalance>
            <p>NOM Balance</p>
            <FooterBalanceValue>
              <strong>23.20931</strong>
              <span> = $16,208.04</span>
            </FooterBalanceValue>
          </FooterBalance>
          <Modal.PrimaryButton type="button">Select validator</Modal.PrimaryButton>
        </Footer>
      </ModalBody>
    </>
  );
}
