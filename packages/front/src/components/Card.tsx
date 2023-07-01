import React from 'react';
import CardFromLib from 'react-bootstrap/Card';
import { PopoverMenu, PopoverMenuProps } from '@components/Popover';


export type CardProps = {
  title: string;
  desc?: React.ReactNode;
  popoverProps: Pick< PopoverMenuProps, 'items' | 'onItemClick' >;
};

export const Card: React.FC< CardProps > = React.memo( ( { title, desc, popoverProps } ) => {
  return (
    <CardFromLib className='gap-2 p-3 h-100'>
      <div className='d-flex gap-2'>
        <h5 className='flex-grow-1'>{ title }</h5>

        <PopoverMenu { ...popoverProps } />
      </div>

      { desc }
    </CardFromLib>
  );
} );
Card.displayName = 'components/Card';
