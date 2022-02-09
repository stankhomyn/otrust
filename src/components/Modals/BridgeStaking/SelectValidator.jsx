import React from 'react';

import ValidatorHeader from './ValidatorHeader';
import ValidatorFooter from './ValidatorFooter';
import ValidatorTable from './ValidatorTable';
import * as Modal from '../styles';
import StakingModal from './StakingModal';

export default function SelectValidator() {
  return (
    <StakingModal>
      <Modal.StakingWrapper>
        <ValidatorHeader />
        <ValidatorTable />
      </Modal.StakingWrapper>
      <ValidatorFooter>
        <Modal.PrimaryButton type="button">Select validator</Modal.PrimaryButton>
      </ValidatorFooter>
    </StakingModal>
  );
}
