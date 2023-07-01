/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import type { State } from '@utils/location/reducer';
import { Link } from '@utils/location/Link';
import styled from 'styled-components';


const Wrap = styled( Breadcrumb )`
  .breadcrumb { padding-left: 0; }
`;

export type BreadcrumbsProps = {
  links: Array< { text: string; location: State[ 'state' ]; route: string } >;
  textForLast: string;
};


const listProps = { className: 'mb-0' };
export const Breadcrumbs: React.FC< BreadcrumbsProps > = React.memo( p => {
  const { links, textForLast } = p;

  return (
    <Wrap listProps={ listProps }>
      {
        links.map( l => (
          <Link
            key={ l.route }
            href={ l.route }
            className='breadcrumb-item'
            location={ l.location }
          >
            <u>{ l.text }</u>
          </Link>
        ) )
      }
      <Breadcrumb.Item active>{ textForLast }</Breadcrumb.Item>
    </Wrap>
  );
} );
Breadcrumbs.displayName = 'components/Breadcrumbs';

// ===================================================================================


export type WithBreadCrumbsProps = React.PropsWithChildren< {
  breadcrumbProps: BreadcrumbsProps;
  className?: string;
} >;


export const WithBreadCrumbs: React.FC< WithBreadCrumbsProps > = React.memo( p => {
  const { breadcrumbProps, children, className = '' } = p;

  return (
    <div className={ `d-flex flex-column p-4 gap-3 flex-grow-1 overflow-auto ${ className }` }>
      <Breadcrumbs { ...breadcrumbProps } />

      { children }
    </div>
  );
} );
WithBreadCrumbs.displayName = 'components/WithBreadcrumbs';
