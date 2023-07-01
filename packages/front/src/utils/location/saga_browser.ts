import {
  takeLatest,
  all,
} from 'redux-saga/effects';
import { aTypes, Actions } from './reducer';
import type { LocationToRoute } from './__locationUnion_helpers';
import * as LoginLocationNS from '../../parts/Auth/Login/locationHelpers';
import * as RegisterLocationNS from '../../parts/Auth/Register/locationHelpers';
import * as MainLocationNS from '../../parts/Main/locationHelpers';
import * as AdminLocationNS from '../../parts/Adminpanel/locationHelpers';
import { history } from '../history';


const LocationToRouteMappers: LocationToRoute[] = [
  LoginLocationNS.locationToRoute,
  RegisterLocationNS.locationToRoute,
  MainLocationNS.locationToRoute,
  AdminLocationNS.locationToRoute,
];


export function* sagaBrowser(): Gen {
  yield all( [
    /**
     * persist redux location change to browser URL, so that we can have\
     * familiar "navigate + refresh through F5" experience
    */
    takeLatest( aTypes.setLocation, function* syncWithUrlOnSetLocation( a: Actions[ 'setLocation' ] ) {
      yield void 1; // so eslint doesn't complain

      const { state, replace } = a.payload;

      const nextRoute = LocationToRouteMappers.reduce< string | null >(
        ( a, mapper ) => ( a === null ? mapper( state ) : a ),
        null,
      );

      if ( nextRoute === null ) return;

      history[ replace ? 'replace' : 'push' ]( nextRoute );
    } ),

    // call( function* subToPopState() {
    //   const historyPopEvtCh = eventChannel< Location >( emit => {
    //     const unsubscribe = history.listen( event => {
    //       if ( event.action !== Action.Pop ) return;

    //       emit( event.location );
    //     } );

    //     return unsubscribe;
    //   } );

    //   while ( true ) {
    //     const location: Location = yield take( historyPopEvtCh );

    //     const reduxLocation = browserLocationToReduxLocation( location );
    //     const finalReduxLocation = reduxLocation || MainLocation.state;

    //     yield put( aCreators.requestToSetLocation( { state: finalReduxLocation } ) );
    //     if ( reduxLocation === false ) history.replace( '/' );
    //   }
    // } ),
  ] );
}
