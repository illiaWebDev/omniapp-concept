import React from 'react';
import Overlay, { OverlayChildren, OverlayProps } from 'react-bootstrap/Overlay';
import { usePortal } from '@utils/stores/EECtx_portal';
import styled from 'styled-components';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import type { ListGroupItemProps } from 'react-bootstrap/ListGroupItem';


const PopoverOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

// eslint-disable-next-line react/function-component-definition
const DefaultOverlayChildren: OverlayChildren = () => <div className='DefaultOverlayChildren' style={ { display: 'none' } } />;

export type PopoverProps = {
  targetComponent: React.ComponentType<{
    targetRef: React.RefObject< HTMLElement >;
    open: () => unknown;
  }>;
  content?: React.ComponentType<{ close: () => unknown }>;
  children?: OverlayChildren;
  popoverOverlayProps?: Partial< React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> >;
  overlayProps?: Partial< OverlayProps >;
};
export const Popover: React.FC< PopoverProps > = React.memo( p => {
  const {
    targetComponent: TargetC,
    children,
    popoverOverlayProps,
    content: Content,
    overlayProps,
  } = p;
  const { show, close } = usePortal();
  const [ isOpen, setIsOpen ] = React.useState( false );
  const closePopover = React.useCallback( () => {
    close();
    setIsOpen( false );
  }, [ close ] );

  const target = React.useRef< HTMLElement >( null );
  const open = React.useCallback( () => {
    setIsOpen( true );
    show(
      {
        Comp: PopoverOverlay,
        props: [
          {
            onClick: ( e: React.MouseEvent< HTMLDivElement > ) => {
              if ( e.target !== e.currentTarget ) return;

              closePopover();
            },
            ...popoverOverlayProps,
          },
        ] },
    );
  }, [ popoverOverlayProps, closePopover, show ] );


  return (
    <>
      <TargetC targetRef={ target } open={ open } />
      <Overlay target={ target.current } show={ isOpen } placement='bottom-end' { ...overlayProps }>
        {
          Content === undefined ? ( children || DefaultOverlayChildren ) : (
            ( {
              placement: _placement,
              arrowProps: _arrowProps,
              show: _show,
              popper: _popper,
              hasDoneInitialMeasure: _hasDoneInitialMeasure,
              ...props
            } ) => (
              <div
                { ...props }
                style={ {
                  position: 'absolute',
                  zIndex: 1,
                  ...props.style,
                } }
              >
                <Content close={ closePopover } />
              </div>
            )
          )
        }
      </Overlay>
    </>
  );
} );
Popover.displayName = 'components/Popover';

// ===================================================================================

const PopoverMenuListGroup = styled( ListGroup )`
  >* { padding: 0.25rem 0.5rem; }
`;

export const PopoverMenuTargetComp: PopoverProps[ 'targetComponent' ] = React.memo( ( { targetRef, open } ) => (
  <Button
    ref={ targetRef as React.RefObject<HTMLButtonElement> }
    onClick={ e => {
      e.stopPropagation();
      open();
    } }
    variant='light'
    size='sm'
    className='rounded-circle'
  >
    <i className='fa-solid fa-ellipsis-vertical' />
  </Button>
) );
PopoverMenuTargetComp.displayName = 'components/PopoverMenu/TargetComp';


export type PopoverMenuProps = {
  items: Array<{ id: string; title: string }>;
  onItemClick: ( id: string ) => unknown;
  popoverProps?: Partial< PopoverProps >;
};

export const PopoverMenu: React.FC< PopoverMenuProps > = React.memo( p => {
  const {
    items,
    onItemClick,
    popoverProps,
  } = p;

  const onItemClickHandler = React.useCallback< NonNullable< ListGroupItemProps[ 'onClick' ] > >(
    ( { currentTarget } ) => {
      if ( !( currentTarget instanceof HTMLElement ) ) return;

      const { dataset: { id } } = currentTarget;
      if ( !id ) return;

      onItemClick( id );
    },
    [ onItemClick ],
  );
  const Content: NonNullable< PopoverProps[ 'content' ] > = React.useCallback( ( { close } ) => (
    <PopoverMenuListGroup>
      {
        items.map( it => (
          <ListGroup.Item
            key={ it.id }
            data-id={ it.id }
            action
            onClick={ e => {
              close();
              onItemClickHandler( e );
            } }
            variant='light'
          >
            { it.title }
          </ListGroup.Item>
        ) )
      }
    </PopoverMenuListGroup>
  ), [ items, onItemClickHandler ] );


  return (
    <Popover
      content={ Content }
      targetComponent={ PopoverMenuTargetComp }
      { ...popoverProps }
    />
  );
} );
PopoverMenu.displayName = 'components/PopoverMenu';
