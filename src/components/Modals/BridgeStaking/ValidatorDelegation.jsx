import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

import ValidatorFooter from './ValidatorFooter';
import { Caption, Desc } from './ValidatorHeader';
import ValidatorNodeHeader from './ValidatorNodeHeader';
import * as Modal from '../styles';
import BackButton from './BackButton';
import StakingModal from './StakingModal';

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
  background-color: #2a2837;

  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.highlightYellow};
`;

export default function ValidatorDelegation({ direction = 'DELEGATE' }) {
  const verb = useMemo(() => (direction === 'DELEGATE' ? 'delegate' : 'undelegate'), [direction]);

  return (
    <StakingModal>
      <Modal.StakingWrapper>
        <BackButton
          clickHandler={() => {
            alert('going back');
          }}
        />

        <ValidatorNodeHeader />

        <div>
          <Caption style={{ textTransform: 'capitalize' }}>{verb} NOMs</Caption>
          <Desc>
            Now you can {verb} part of your NOMs to the desired validator. After that this part will
            be locked inside validator node, and you will start to receive yield
          </Desc>

          <FieldWrapper>
            <InputWrapper>
              <span style={{ textTransform: 'capitalize' }}>{verb} NOMs</span>
              <input type="text" placeholder="0.0" />
            </InputWrapper>
            <MaxButton>MAX</MaxButton>
          </FieldWrapper>
        </div>
      </Modal.StakingWrapper>
      <ValidatorFooter>
        <Link to="/validator-node">
          <Modal.SecondaryButton type="button">Back</Modal.SecondaryButton>
        </Link>
        <Link to="/validator-delegation/success">
          <Modal.PrimaryButton type="button">Confirm</Modal.PrimaryButton>
        </Link>
      </ValidatorFooter>
    </StakingModal>
  );
}
