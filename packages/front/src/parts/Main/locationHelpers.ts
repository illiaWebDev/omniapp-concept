import type { LocationToRoute, RouteToLocationOnBootstrap } from '@utils/location/__locationUnion_helpers';
import { state, State } from './locationT';


export function matchesReduxLocation( s: unknown ): s is State {
  if ( typeof s !== 'object' || s === null ) return false;
  if ( Object.keys( s ).length !== 1 ) return false;

  return ( s as State ).route === state.route;
}

export const locationToRoute: LocationToRoute = s => {
  if ( !matchesReduxLocation( s ) ) return null;

  return s.route;
};


export const routeToLocationOnBootstrap: RouteToLocationOnBootstrap = path => {
  if ( path !== state.route ) return null;

  return state;
};
