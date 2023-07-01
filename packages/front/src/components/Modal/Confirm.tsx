import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import type { PortalComp } from '@utils/stores/EECtx_portal';
import { CoreModal, CoreModalProps } from './Core';


export type ConfirmModalProps = Pick< CoreModalProps, 'title' | 'modalProps' > & {
  onConfirm: () => unknown;
  onDecline?: () => unknown;
};

export const ConfirmModal: PortalComp = React.memo( p => {
  const { title, onConfirm, modalProps, onDecline } = p as ConfirmModalProps;

  return (
    <CoreModal
      noCloseButton
      modalProps={ modalProps }
      title={ title }
      contents={ (
        <Modal.Footer>
          { onDecline && (
            <Button variant='secondary' onClick={ onDecline }>
              Ні
            </Button>
          ) }
          <Button variant='primary' onClick={ onConfirm }>
            Так
          </Button>
        </Modal.Footer>
      ) }
    />
  );
} );
ConfirmModal.displayName = 'components/Modal/Confirm';
