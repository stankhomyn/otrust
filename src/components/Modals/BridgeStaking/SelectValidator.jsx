import React from 'react';
import { Link } from 'react-router-dom';

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
        <Link to="/validator-node">
          <Modal.PrimaryButton type="button">Select validator</Modal.PrimaryButton>
        </Link>
      </ValidatorFooter>
    </StakingModal>
  );
}
