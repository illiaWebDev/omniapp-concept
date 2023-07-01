import React from 'react';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form, { FormProps } from 'react-bootstrap/Form';
import * as LoadingDots from '@components/LoadingDots';
import styled from 'styled-components';
import { CoreModal, CoreModalProps } from './Core';


const StyledCoreModal = styled( CoreModal )<{ $fullscreen: boolean }>`
  ${ p => ( p.$fullscreen === false ? '' : '.modal-content { max-height: initial; }' ) }
`;


export type FormBasedProps = Pick< CoreModalProps, 'title' | 'modalProps' | 'noCloseButton' > & {
  title: string;
  submitBtnText: string;
  controls: React.ReactNode;
  onSubmit: NonNullable< FormProps['onSubmit'] >;
  modalProps?: ModalProps;
  isSubmitting: boolean;
  className?: string;
  noFooter?: boolean;
};
/**
 * wraps CoreModal, adds Form around controls and footer content,\
 * so that it can represent really generic modal, that contains \
 * form that should be submitted
 */
export const FormBased: React.FC< FormBasedProps > = React.memo( p => {
  const {
    title,
    modalProps,
    submitBtnText,
    controls,
    onSubmit,
    isSubmitting,
    className,
    noFooter,
    noCloseButton,
  } = p;

  return (
    <StyledCoreModal
      $fullscreen={ Boolean( modalProps && modalProps.fullscreen ) }
      title={ title }
      modalProps={ modalProps }
      contents={ (
        <Form onSubmit={ onSubmit } className='d-flex flex-column overflow-auto flex-grow-1'>
          <Modal.Body className='overflow-auto d-flex flex-column gap-3'>
            { controls }
          </Modal.Body>

          { noFooter ? null : (
            <Modal.Footer>
              <Button variant='primary' type='submit' disabled={ isSubmitting }>
                { isSubmitting ? LoadingDots.JSX : submitBtnText }
              </Button>
            </Modal.Footer>
          ) }
        </Form>
      ) }
      className={ className }
      noCloseButton={ noCloseButton }
    />
  );
} );
FormBased.displayName = 'components/Modal/FormBased';
