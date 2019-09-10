import './Modal.css';

import React from 'react';
import ResponsiveModal from 'react-responsive-modal';

interface IModalProps {
  title: string;
  show: boolean;
  onClose: (event?: React.MouseEvent) => void;
}

class Modal extends React.Component<IModalProps, {}> {
  public render() {
    const { show, onClose, title, children } = this.props;

    return (
      <ResponsiveModal
        open={show}
        onClose={onClose}
        classNames={{
          closeIcon: 'close-icon',
          modal: 'modal-responsive',
          overlay: 'modal-overlay'
        }}
      >
        <h2>{title}</h2>
        {children}
      </ResponsiveModal>
    );
  }
}

export default Modal;
