import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
// import { validatePayload } from '@omniapp-concept/common/dist/jwt/get';
import { FormBased } from '@components/Modal/FormBased';
// import { createRhfResolver } from '@utils/createRhfResolver';
import { Link, WithMatchRoute, WithMatchRouteProps } from '@utils/location';
import { aCreators, Actions } from '../reducer';
import { state as locationState } from './locationT';
import * as registerLocationNS from '../Register/locationT';


type Data = Actions[ 'requestToLogin' ][ 'payload' ][ 'data' ];
// type Data = { username: string; password: string };


// const resolver = createRhfResolver( validatePayload );
const noop = () => undefined;

const Core = React.memo( () => {
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { isSubmitting } } = useForm< Data >( {
    defaultValues: { password: '', username: '' },
    // resolver,
  } );

  const onSubmit = React.useMemo(
    () => handleSubmit( data => dispatch( aCreators.requestToLogin( { data } ) ) ),
    [ handleSubmit, dispatch ],
  );


  return (
    <FormBased
      title='Логін'
      modalProps={ { centered: true, size: 'sm', onHide: noop, animation: false } }
      controls={ (
        <>
          <Controller
            control={ control }
            name='username'
            render={ ( {
              field: { onChange, value },
              fieldState: { error },
            } ) => (
              <Form.Group>
                <Form.Control isInvalid={ Boolean( error ) } placeholder='Ваш логін' onChange={ onChange } value={ value } />
                <Form.Control.Feedback type='invalid'>{ error?.message || '⠀' }</Form.Control.Feedback>
              </Form.Group>
            ) }
          />

          <Controller
            control={ control }
            name='password'
            render={ ( {
              field: { onChange, value },
              fieldState: { error },
            } ) => (
              <Form.Group>
                <Form.Control isInvalid={ Boolean( error ) } type='password' placeholder='Ваш пароль' onChange={ onChange } value={ value } />
                <Form.Control.Feedback type='invalid'>{ error?.message || '⠀' }</Form.Control.Feedback>
              </Form.Group>
            ) }
          />

          <Link
            href={ registerLocationNS.state.route }
            location={ registerLocationNS.state }
          >
            <span className='text-decoration-underline'>Немає акаунту? Зареєструватись</span>
          </Link>
        </>
      ) }
      isSubmitting={ isSubmitting }
      onSubmit={ onSubmit }
      submitBtnText='Підтвердити'
      noCloseButton
    />
  );
} );
Core.displayName = 'parts/Auth/Login/Comp/Core';


const locationsMatch: WithMatchRouteProps[ 'locationsMatch' ] = l => l.route === locationState.route;

export const _ = React.memo( () => (
  <WithMatchRoute locationsMatch={ locationsMatch }>
    <Core />
  </WithMatchRoute>
) );
Core.displayName = 'parts/Auth/Login/Comp';
