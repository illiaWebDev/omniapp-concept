import React from 'react';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import styled from 'styled-components';
import { usePortal } from '@utils/stores/EECtx_portal';


const StyledModal = styled( Modal )`
  .modal-content {
    max-height: calc( 100vh - 3.5rem );
    overflow: auto;
  }
`;


export type CoreModalProps = {
  title: string;
  modalProps?: ModalProps;
  noCloseButton?: true;
  contents: React.ReactNode;
  className?: string;
};

/**
 * wraps slightly styled bootstrap Modal, adds default \
 * show/close with delay to animate logic, adds title \
 * and close button (with ability to hide it) but also allows\
 * complete reassignment of all Bootstrap ModalProps
 */
export const CoreModal: React.FC< CoreModalProps > = React.memo( p => {
  const { title, modalProps, contents, noCloseButton, className } = p;

  const [ show, setShow ] = React.useState( true );
  const portal = usePortal();
  const close = React.useCallback( () => {
    setShow( false );
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    setTimeout( portal.close, 200 );
  }, [ portal.close ] );


  return (
    <StyledModal show={ show } onHide={ close } className={ className } { ...modalProps }>
      <Modal.Header closeButton={ !noCloseButton }>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>

      { contents }
    </StyledModal>
  );
} );
CoreModal.displayName = 'components/Modal/Core';

// ===================================================================================

export type UseWithUnsavedChangesArg = {
  isDirty: boolean;
  modalProps?: ModalProps;
};

export type UseWithUnsavedChangesRtrn = ModalProps;
/**
 * some modals with forms are very sensitive to "not closing if\
 * they have unsaved changes". This utility hook aims to solve \
 * that in a somewhat reusable manner. Main idea is that we would\
 * override modalProps for core and inject onHide handler where\
 * we will decide if we can proceed with closing or should not \
 * close modal
 */
export const useWithUnsavedChanges = (
  { isDirty, modalProps }: UseWithUnsavedChangesArg,
): UseWithUnsavedChangesRtrn => {
  const [ isOpen, setIsOpen ] = React.useState( true );
  const isDirtyRef = React.useRef( isDirty );
  if ( isDirtyRef.current !== isDirty ) isDirtyRef.current = isDirty;

  const { close: closePortal } = usePortal();
  const close = React.useCallback( () => {
    if ( isDirtyRef.current ) {
      // eslint-disable-next-line no-restricted-globals, no-alert
      const closeConfirmed = confirm( 'Всі не збережені дані будуть втрачені. Закрити?' );
      if ( closeConfirmed === false ) return;
    }

    setIsOpen( false );
    setTimeout( () => closePortal(), 200 );
  }, [ closePortal ] );

  return React.useMemo( () => ( {
    show: isOpen,
    onHide: close,
    ...modalProps,
  } ), [ isOpen, close, modalProps ] );
};
