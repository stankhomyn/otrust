import React, { useState } from 'react';

// import ModalComponent from 'components/Modals/components/ModalComponent';
import BridgeSwapMain from 'components/Modals/components/BridgeSwapMain';
import { PrimaryButton } from 'components/Modals/styles';
import {
  Balances,
  Balance,
  BalancePrice,
  BalanceNumber,
  Hint,
  TooltipCaption,
  TooltipDesc,
  TrimmedApproved,
  WithdrawBtnWrapper,
} from './SidebarStyles';
import { SidebarBridgedBalance } from './SidebarBridgedBalance';

export default function SidebarBalances({ strong, weak, strongBalance, weakBalance, allowance }) {
  // const { handleModal } = useModal();
  const [showBridge, setShowBridge] = useState(false);

  return (
    <>
      <Balances>
        <Balance>
          <BalancePrice>
            <strong>{strong} Balance</strong>
            <BalanceNumber>
              {strongBalance}
              <small> = $16,208.04</small>
            </BalanceNumber>
          </BalancePrice>
          <Hint>
            <TooltipCaption>ETH Balance</TooltipCaption>
            <TooltipDesc>This is your connected wallet Ether balance.</TooltipDesc>
          </Hint>
        </Balance>
        <Balance>
          <BalancePrice>
            <strong>{weak} Balance</strong>
            <BalanceNumber strong>
              {weakBalance}
              <small> = $16,208.04</small>
              <TrimmedApproved value={allowance} />
              {/* <CloseIcon onClick={() => {}} /> */}
            </BalanceNumber>
          </BalancePrice>
          <Hint>
            <TooltipCaption>NOM Balance</TooltipCaption>
            <TooltipDesc>
              This shows your total wNOM balance and the amount approved for selling. You must
              approve wNOM for selling before it can be sold.
            </TooltipDesc>
          </Hint>
        </Balance>

        <SidebarBridgedBalance />

        <WithdrawBtnWrapper>
          <PrimaryButton style={{ width: '100%' }} onClick={() => setShowBridge(true)}>
            Bridge wNOM to NOM
          </PrimaryButton>
        </WithdrawBtnWrapper>
      </Balances>
      {showBridge && <BridgeSwapMain closeBridgeModal={() => setShowBridge(false)} />}
    </>
  );
}
