import React from 'react';
import { WithMatchRoute, WithMatchRouteProps } from '@utils/location/WithMatchRoute';
import { state } from './locationT';


const locationsMatch: WithMatchRouteProps[ 'locationsMatch' ] = l => l.route === state.route;

export const _ = React.memo( () => (
  <WithMatchRoute locationsMatch={ locationsMatch }>
    <div>page not found</div>
  </WithMatchRoute>
) );
_.displayName = 'parts/404';
