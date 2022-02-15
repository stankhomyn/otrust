import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import ValidatorHeader from './ValidatorHeader';
import ValidatorFooter from './ValidatorFooter';
import ValidatorTable from './ValidatorTable';
import * as Modal from '../styles';
import StakingModal from './StakingModal';

export default function SelectValidator() {
  const [selected, setSelected] = useState('');

  return (
    <StakingModal>
      <Modal.StakingWrapper>
        <ValidatorHeader />
        <ValidatorTable selected={selected} setSelected={setSelected} />
      </Modal.StakingWrapper>
      <ValidatorFooter>
        {selected ? (
          <Link to={`/validator-node/${selected}`}>
            <Modal.PrimaryButton type="button">Select validator</Modal.PrimaryButton>
          </Link>
        ) : (
          <Modal.PrimaryButton type="button" disabled>
            Select validator
          </Modal.PrimaryButton>
        )}
      </ValidatorFooter>
    </StakingModal>
  );
}
