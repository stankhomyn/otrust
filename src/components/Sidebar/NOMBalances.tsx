import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { EquivalentValue } from 'components/EquivalentValue';
import {
  Balances,
  Balance,
  BalancePrice,
  BalanceNumber,
  Hint,
  TooltipCaption,
  TooltipDesc,
} from './SidebarStyles';
import { PrimaryButton } from 'components/Modals/styles';

const ButtonWrapper = styled.div`
  margin-top: 20px;
`;

export default function NOMBalances() {
  return (
    <Balances>
      <Balance>
        <BalancePrice>
          <strong>NOM Balance (Bridged)</strong>
          <BalanceNumber strong>
            23.2091
            <small>
              <EquivalentValue amount={4208.12} asset="ETH" />
            </small>
          </BalanceNumber>
        </BalancePrice>
        <Hint>
          <TooltipCaption>NOM Balance (Bridged)</TooltipCaption>
          <TooltipDesc>Your NOM balance on the Onomy Network</TooltipDesc>
        </Hint>
      </Balance>

      <Balance>
        <BalancePrice>
          <strong>NOM Delegated</strong>
          <BalanceNumber strong>
            23.2091
            <small>
              <EquivalentValue amount={4208.12} asset="ETH" />
            </small>
          </BalanceNumber>
        </BalancePrice>
        <Hint>
          <TooltipCaption>NOM Delegated</TooltipCaption>
          <TooltipDesc>NOM delegated to earn staking rewards</TooltipDesc>
        </Hint>
      </Balance>

      <ButtonWrapper>
        <Link to="/validators">
          <PrimaryButton style={{ width: '100%' }}>Manage Staking</PrimaryButton>
        </Link>
      </ButtonWrapper>
    </Balances>
  );
}
