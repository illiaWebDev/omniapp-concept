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
import * as LoginLocationNS from '../Login/locationT';

type Data = Actions[ 'requestToRegister' ][ 'payload' ][ 'data' ];


// const resolver = createRhfResolver( validatePayload );
const noop = () => undefined;

const Core = React.memo( () => {
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { isSubmitting } } = useForm< Data >( {
    defaultValues: { password: '', username: '' },
    // resolver,
  } );

  const onSubmit = React.useMemo(
    () => handleSubmit( data => dispatch( aCreators.requestToRegister( { data } ) ) ),
    [ handleSubmit, dispatch ],
  );


  return (
    <FormBased
      title='Реєстрація'
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
                <Form.Control isInvalid={ Boolean( error ) } placeholder='Логін' onChange={ onChange } value={ value } />
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
                <Form.Control isInvalid={ Boolean( error ) } type='password' placeholder='Пароль' onChange={ onChange } value={ value } />
                <Form.Control.Feedback type='invalid'>{ error?.message || '⠀' }</Form.Control.Feedback>
              </Form.Group>
            ) }
          />

          <Link
            href={ LoginLocationNS.state.route }
            location={ LoginLocationNS.state }
          >
            <span className='text-decoration-underline'>Вже зареєстровані? Увійти</span>
          </Link>
        </>
      ) }
      isSubmitting={ isSubmitting }
      onSubmit={ onSubmit }
      submitBtnText='Зареєструватись'
      noCloseButton
    />
  );
} );
Core.displayName = 'parts/Auth/Register/Comp/Core';


const locationsMatch: WithMatchRouteProps[ 'locationsMatch' ] = l => l.route === locationState.route;

export const _ = React.memo( () => (
  <WithMatchRoute locationsMatch={ locationsMatch }>
    <Core />
  </WithMatchRoute>
) );
Core.displayName = 'parts/Auth/Register/Comp';
