import React from 'react';
import styled from 'styled-components/macro';

import { Dimmer } from 'components/UI';
import ValidatorHeader from './ValidatorHeader';
import ValidatorFooter from './ValidatorFooter';
import ValidatorTable from './ValidatorTable';
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

export default function SelectValidator() {
  return (
    <>
      <Dimmer />

      <ModalBody>
        <Wrapper>
          <ValidatorHeader />
          <ValidatorTable />
        </Wrapper>
        <ValidatorFooter>
          <Modal.PrimaryButton type="button">Select validator</Modal.PrimaryButton>
        </ValidatorFooter>
      </ModalBody>
    </>
  );
}
