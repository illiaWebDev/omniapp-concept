import React from 'react';
import { useTypedSelector } from '@utils/stores/redux_constants';
import * as page404NS from './404';
import * as AuthNS from './Auth';
import * as AppLayoutNS from './App_layout';


export const App = React.memo( () => {
  const isAutologinAttempted = useTypedSelector( s => s.auth.isAutologinAttempted );
  const isInDummyLocationState = useTypedSelector( s => s.location.state.route === '' );

  if ( isAutologinAttempted === false || isInDummyLocationState ) return null;

  return (
    <>
      <page404NS.Comp._ />

      <AuthNS.Login.Comp._ />
      <AuthNS.Register.Comp._ />

      <AppLayoutNS._ />
    </>
  );
} );
App.displayName = 'src/App';
