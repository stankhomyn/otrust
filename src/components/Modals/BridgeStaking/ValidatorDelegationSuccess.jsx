import React, { useMemo } from 'react';
import styled from 'styled-components/macro';

import { Dimmer } from 'components/UI';
import ValidatorFooter from './ValidatorFooter';
import { Success } from '../Icons';
import { Caption, Desc } from './ValidatorHeader';
import * as Modal from '../styles';
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

const DeligatedWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 32px 40px;

  position: relative;

  background-color: ${props => props.theme.colors.bgNormal};
  border-radius: 8px;

  > strong {
    position: absolute;
    left: 40px;

    color: ${props => props.theme.colors.highlightBlue};
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 500;
  }

  > span {
    font-size: 24px;
    font-weight: 500;

    color: ${props => props.theme.colors.textPrimary};

    sup {
      margin-left: 8px;
      font-size: 12px;
    }
  }
`;

export default function ValidatorDelegationSuccess({ direction = 'DELEGATE' }) {
  const verb = useMemo(() => (direction === 'DELEGATE' ? 'delegated' : 'undelegated'), [direction]);

  return (
    <>
      <Dimmer />

      <ModalBody>
        <Wrapper>
          <ValidatorNodeHeader />

          <div>
            <Modal.ModalIconWrapper>
              <Success />
            </Modal.ModalIconWrapper>

            <Caption style={{ textAlign: 'center', textTransform: 'capitalize' }}>
              {verb} successfully!
            </Caption>
            <Desc>
              Now you can delegate part of your NOMs to the desired validator. After that this part
              will be locked inside validator node, and you will start to receive yield
            </Desc>
            <DeligatedWrapper>
              <strong style={{ textTransform: 'capitalize' }}>{verb}</strong>
              <span>
                2544.24<sup>NOM</sup>
              </span>
            </DeligatedWrapper>
          </div>
        </Wrapper>
        <ValidatorFooter>
          <Modal.SecondaryButton type="button">Back to validator</Modal.SecondaryButton>
          <Modal.PrimaryButton type="button">Done</Modal.PrimaryButton>
        </ValidatorFooter>
      </ModalBody>
    </>
  );
}
