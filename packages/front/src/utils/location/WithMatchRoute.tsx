import React from 'react';
import { useTypedSelector } from '../stores/redux_constants';
import type { State } from './reducer';


export type WithMatchRouteProps = {
  locationsMatch: ( locationInState: State[ 'state' ] ) => boolean;
};


export const WithMatchRoute: React.FC< React.PropsWithChildren< WithMatchRouteProps > > = React.memo( p => {
  const { children, locationsMatch } = p;
  const locationStateInStore = useTypedSelector( s => s.location.state );

  return locationsMatch( locationStateInStore )
    // eslint-disable-next-line react/jsx-no-useless-fragment
    ? <>{ children }</>
    : null;
} );
WithMatchRoute.displayName = 'utils/location/WithMatchRoute';
