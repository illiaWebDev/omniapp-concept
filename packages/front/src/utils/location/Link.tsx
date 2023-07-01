import React from 'react';
import { useDispatch } from 'react-redux';
import Nav from 'react-bootstrap/Nav';
import { aCreators, State } from './reducer';


export type LinkProps = {
  location: State[ 'state' ];
  href: string;
  className?: string;
  /**
   * this was created so that after we click a link \
   * we can run "close offcanvas" on mobile devices
   */
  afterDispatch?: () => unknown;
};

export const Link: React.FC< React.PropsWithChildren< LinkProps > > = React.memo( p => {
  const dispatch = useDispatch();
  const { location, className, children, href, afterDispatch } = p;
  const onClick = React.useCallback< React.MouseEventHandler< HTMLAnchorElement > >( e => {
    e.preventDefault();

    dispatch( aCreators.requestToSetLocation( { state: location } ) );
    if ( afterDispatch !== undefined ) afterDispatch();
  }, [ location, dispatch, afterDispatch ] );


  return (
    <Nav.Link onClick={ onClick } className={ className } href={ href }>
      { children }
    </Nav.Link>
  );
} );
Link.displayName = 'utils/location/Link';
