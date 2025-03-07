import React from 'react';
import ReactDOM from 'react-dom';

import { Dimmer } from 'components/UI/Dimmer';
import { useModal } from 'context/modal/ModalContext';

const Modal = () => {
  const { modalContent, modal } = useModal();
  if (modal) {
    return ReactDOM.createPortal(
      <Dimmer>{modalContent}</Dimmer>,
      document.querySelector('#modal-root')
    );
  }
  return null;
};

export default Modal;
