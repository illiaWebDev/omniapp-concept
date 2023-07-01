import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { WithMatchRoute, WithMatchRouteProps } from '@utils/location/WithMatchRoute';
import * as location from './locationT';


const Core = React.memo( () => {
  return (
    <Container fluid className='text-center h-100'>
      <Row className='h-100 align-items-center'>
        <Col>
          <h3>Розпочніть прямо зараз</h3>
        </Col>
      </Row>
    </Container>
  );
} );
Core.displayName = 'parts/Main/Core';


const locationsMatch: WithMatchRouteProps[ 'locationsMatch' ] = l => l.route === location.state.route;

export const _ = React.memo( () => (
  <WithMatchRoute locationsMatch={ locationsMatch }>
    <Core />
  </WithMatchRoute>
) );
_.displayName = 'parts/Main';
