import React from 'react';
import styled from 'styled-components/macro';

import { Dimmer } from 'components/UI';
import ValidatorFooter from './ValidatorFooter';
import { Caption, Desc } from './ValidatorHeader';
import { Sending, ExchangeInput, MaxBtn, SendingBox } from '../../Exchange/exchangeStyles';
import ValidatorNodeHeader from './ValidatorNodeHeader';

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

export default function ValidatorDelegation() {
  return (
    <>
      <Dimmer />

      <ModalBody>
        <Wrapper>
          <ValidatorNodeHeader />

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
