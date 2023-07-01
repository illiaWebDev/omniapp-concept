import React from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
// import { validatePayload } from '@omniapp-concept/common/dist/jwt/get';
// import { FormBased } from '@components/Modal/FormBased';
// import { createRhfResolver } from '@utils/createRhfResolver';
import { WithMatchRoute, WithMatchRouteProps } from '@utils/location';
import { useTypedSelector } from '@utils/stores/redux_constants';
// import * as registerLocationNS from '../Register/locationT';
import Table from 'react-bootstrap/Table';
import Button, { ButtonProps } from 'react-bootstrap/Button';
import { aCreators, Actions } from './reducer';
import { state as locationState } from './locationT';


type ApproveA = Actions['requestToApproveRegRequest'];

const Core = React.memo( () => {
  const dispatch = useDispatch();
  const users = useTypedSelector( s => s.adminpanel.users );

  const approveRegRequest = React.useCallback< NonNullable< ButtonProps[ 'onClick' ] > >( e => {
    const { id } = e.currentTarget.dataset;
    if ( id === undefined ) return;

    // eslint-disable-next-line no-restricted-globals, no-alert
    const proceed = confirm( 'Схвалити?' );
    if ( proceed === false ) return;

    dispatch( aCreators.requestToApproveRegRequest( { id: id as ApproveA[ 'payload' ][ 'id' ] } ) );
  }, [ dispatch ] );

  return (
    <div className='p-3'>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map( ( u, i ) => (
              <tr key={ u.id }>
                <td>{ i + 1 }</td>
                <td>{ u.username }</td>
                <td>
                  { ( () => {
                    if ( u.status === 'registered' ) return u.status;

                    return (
                      <Button data-id={ u.id } onClick={ approveRegRequest }>
                        Схвалити
                      </Button>
                    );
                  } )() }
                </td>
              </tr>
            ) )
          }
        </tbody>
      </Table>
    </div>
  );
} );
Core.displayName = 'parts/Auth/Login/Comp/Core';


const locationsMatch: WithMatchRouteProps[ 'locationsMatch' ] = l => l.route === locationState.route;

export const _ = React.memo( () => (
  <WithMatchRoute locationsMatch={ locationsMatch }>
    <Core />
  </WithMatchRoute>
) );
Core.displayName = 'parts/Admin/Comp';
