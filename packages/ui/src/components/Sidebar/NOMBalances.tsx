import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useOnomy, useBridgedBalanceValue, useDelegationTotalValue } from '@onomy/react-client';

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
import { NomBalanceDisplay } from 'components/NomBalanceDisplay';
import { EquivalentValue } from 'components/EquivalentValue';
import { format18 } from 'utils/math';

const ButtonWrapper = styled.div`
  margin-top: 20px;
`;

export default function NOMBalances() {
  const { address } = useOnomy();
  const bridged = useBridgedBalanceValue();
  const [delegated] = useDelegationTotalValue();

  return (
    <Balances>
      {address && (
        <>
          <Balance>
            <BalancePrice>
              <strong>NOM Balance (Bridged)</strong>
              <BalanceNumber strong>
                <NomBalanceDisplay value={bridged.toString()} />
                <small>
                  <EquivalentValue amount={format18(bridged).toNumber()} asset="NOM" />
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
              <strong>Staked NOM</strong>
              <BalanceNumber strong>
                <NomBalanceDisplay value={delegated.toString()} />
                <small>
                  <EquivalentValue amount={format18(delegated).toNumber()} asset="NOM" />
                </small>
              </BalanceNumber>
            </BalancePrice>
            <Hint>
              <TooltipCaption>Staked NOM</TooltipCaption>
              <TooltipDesc>NOM delegated to earn staking rewards</TooltipDesc>
            </Hint>
          </Balance>
        </>
      )}

      <ButtonWrapper>
        <Link to="/validators">
          <PrimaryButton style={{ width: '100%' }}>Manage Staking</PrimaryButton>
        </Link>
      </ButtonWrapper>
    </Balances>
  );
}
