import React, { useMemo } from 'react';
import styled from 'styled-components/macro';

import { Dimmer } from 'components/UI';
import ValidatorFooter from './ValidatorFooter';
import { Caption, Desc } from './ValidatorHeader';
import ValidatorNodeHeader from './ValidatorNodeHeader';
import * as Modal from '../styles';
import BackButton from './BackButton';

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

const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 76px;
  padding: 12px;

  background-color: ${props => props.theme.colors.bgHighlightBorder};
  border-radius: 8px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  padding: 4px 12px;

  span {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme.colors.textThirdly};
  }

  input {
    background: transparent;
    border: none;

    font-size: 18px;
    font-weight: 500;
    color: ${props => props.theme.colors.textPrimary};

    &:focus,
    &:active {
      outline: none;
    }
  }
`;

const MaxButton = styled.button`
  width: 70px;
  height: 100%;

  border: none;
  border-radius: 7px;
  background-color: ${props => props.theme.colors.bgNormal};

  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.highlightYellow};
`;

export default function ValidatorDelegation({ direction = 'DELEGATE' }) {
  const verb = useMemo(() => (direction === 'DELEGATE' ? 'delegate' : 'undelegate'), [direction]);

  return (
    <>
      <Dimmer />

      <ModalBody>
        <Wrapper>
          <BackButton
            clickHandler={() => {
              alert('going back');
            }}
          />

          <ValidatorNodeHeader />

          <div>
            <Caption style={{ textTransform: 'capitalize' }}>{verb} NOMs</Caption>
            <Desc>
              Now you can {verb} part of your NOMs to the desired validator. After that this part
              will be locked inside validator node, and you will start to receive yield
            </Desc>

            <FieldWrapper>
              <InputWrapper>
                <span style={{ textTransform: 'capitalize' }}>{verb} NOMs</span>
                <input type="text" placeholder="0.0" />
              </InputWrapper>
              <MaxButton>MAX</MaxButton>
            </FieldWrapper>
          </div>
        </Wrapper>
        <ValidatorFooter>
          <Modal.SecondaryButton type="button">Back</Modal.SecondaryButton>
          <Modal.PrimaryButton type="button">Confirm</Modal.PrimaryButton>
        </ValidatorFooter>
      </ModalBody>
    </>
  );
}
