import { put, takeLatest } from 'redux-saga/effects';
import * as authReduxNS from '../../parts/Auth/reducer';
import type { LocationsUnion } from './__locationUnionT';
import type { RouteToLocationOnBootstrap } from './__locationUnion_helpers';
import { aCreators } from './reducer';
import * as location404NS from '../../parts/404/locationT';
import * as loginLocationNS from '../../parts/Auth/Login/locationHelpers';
import * as regiisterLocationNS from '../../parts/Auth/Register/locationHelpers';
import * as mainLocationNS from '../../parts/Main/locationHelpers';
import * as adminLocationNS from '../../parts/Adminpanel/locationHelpers';


const mappers: RouteToLocationOnBootstrap[] = [
  loginLocationNS.routeToLocationOnBootstrap,
  regiisterLocationNS.routeToLocationOnBootstrap,
  mainLocationNS.routeToLocationOnBootstrap,
  adminLocationNS.routeToLocationOnBootstrap,
];

// STEP 2 (app proceeds bootstraping here)
export function* bootstrapFromRouteSaga( route: string ): Gen {
  yield takeLatest( authReduxNS.aTypes.setAutologinAttempted, function* bootstrapFromRouteAfterAutologin() {
    const location = mappers.reduce< LocationsUnion >(
      ( a, mapper ) => {
        if ( a.route !== location404NS.state.route ) return a;

        return mapper( route ) || a;
      },
      location404NS.state,
    );

    yield put( aCreators.requestToSetLocation( { state: location } ) );
  } );
}
