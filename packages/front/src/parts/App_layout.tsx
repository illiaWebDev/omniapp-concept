import React from 'react';
import { useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { WithMatchRoute, WithMatchRouteProps } from '@utils/location/WithMatchRoute';
import { Link } from '@utils/location/Link';
import { UserRole } from '@omniapp-concept/common/dist/services/User/core';
import * as AdminNS from './Adminpanel';
import { aCreators as authACreators } from './Auth/reducer';
import * as MainNS from './Main';
import { ShowBasedOnRole } from './Auth/Comp/ShowBasedOnRole';


const expand = 'sm';

const Header = React.memo( () => {
  const dispatch = useDispatch();
  const logout = React.useCallback( () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const proceed = confirm( 'Вийти?' );
    if ( proceed === false ) return;

    dispatch( authACreators.requestToLogout() );
  }, [ dispatch ] );

  const headerRef = React.useRef< HTMLDivElement >( null );
  const afterNavigateDispatch = React.useCallback( () => {
    const { current } = headerRef;
    if ( current === null ) return;

    const maybeCloseBtn = current.querySelector( '.btn-close' );
    if ( maybeCloseBtn instanceof HTMLButtonElement ) {
      maybeCloseBtn.click();
    }
  }, [] );
  const linkToMain = React.useMemo( () => (
    <Link
      href={ MainNS.locationT.state.route }
      location={ MainNS.locationT.state }
      afterDispatch={ afterNavigateDispatch }
    >
      OmniApp Concept
    </Link>
  ), [ afterNavigateDispatch ] );

  return (
    <Navbar bg='dark' variant='dark' expand={ expand }>
      <Container fluid>
        <Navbar.Brand>
          { linkToMain }
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Offcanvas placement='start' id={ `offcanvasNavbar-expand-${ expand }` }>
          <Offcanvas.Header closeButton ref={ headerRef }>
            <Offcanvas.Title>{ linkToMain }</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className='flex-grow-1 pe-3'>
              <div className='flex-grow-1'>
                <ShowBasedOnRole allowedRoles={ React.useMemo( () => [ UserRole.admin ], [] ) }>
                  <Link
                    href={ AdminNS.locationT.state.route }
                    location={ AdminNS.locationT.state }
                    afterDispatch={ afterNavigateDispatch }
                  >
                    { AdminNS.locationT.NAME }
                  </Link>
                </ShowBasedOnRole>
              </div>


              <Nav.Link onClick={ logout }>
                <i className='fa fa-sign-out' />
              </Nav.Link>

              { /* <NavDropdown title='Auth' align='end'>
                <NavDropdown.Item onClick={ }>
                  Вийти
                </NavDropdown.Item>
              </NavDropdown> */ }
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
} );
Header.displayName = 'parts/AppLayout/HEader';


const locationsMatch: WithMatchRouteProps[ 'locationsMatch' ] = l => {
  switch ( l.route ) {
    case MainNS.locationT.state.route:
    case AdminNS.locationT.state.route:
      return true;
    default: return false;
  }
};

export const _ = React.memo( () => (
  <WithMatchRoute locationsMatch={ locationsMatch }>
    <Header />

    <MainNS.Comp._ />
    <AdminNS.Comp._ />
  </WithMatchRoute>
) );
_.displayName = 'parts/AppLayout';
