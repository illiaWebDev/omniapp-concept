import * as routesNS from '@omniapp-concept/common/dist/services/User/routes';
import type { BeforeNavigateSaga } from '@utils/location/__locationUnion_helpers';
import { call, put, all, takeLatest } from 'redux-saga/effects';
import { fetchSaga } from '@utils/fetchSaga';
import { matchesReduxLocation } from './locationHelpers';
import {
  NavigateTo404IfNotAllowedSagaRtrn,
  navigateTo404IfNotAllowedSaga,
} from '../Auth/saga/navigateTo404IfNotAllowed';
import { aCreators, aTypes, Actions } from './reducer';


export const beforeNavigate: BeforeNavigateSaga = function* ( l ) {
  if ( !matchesReduxLocation( l ) ) return 'noOverrideHappened';


  const rtrn: NavigateTo404IfNotAllowedSagaRtrn = yield call(
    navigateTo404IfNotAllowedSaga,
    [ 'admin' ],
  );
  if ( rtrn === 'overrideHappened' ) return 'overrideHappened';

  yield put( aCreators.requestToLoadUsers() );

  return 'noOverrideHappened';
};

// ===================================================================================

function* onRequestToLoadUsers() {
  const resp: routesNS.getListForAdmin.Resp = yield call(
    fetchSaga,
    { path: routesNS.getListForAdmin.route },
  );

  if ( resp.success ) {
    yield put( aCreators.setUsers( resp.data ) );
  }
}

function* onRequestToApproveRegRequest( a: Actions['requestToApproveRegRequest'] ) {
  const body: routesNS.approveRegRequest.Arg = a.payload;
  const resp: routesNS.approveRegRequest.Resp = yield call(
    fetchSaga,
    { path: routesNS.approveRegRequest.route, body },
  );

  if ( resp.success ) {
    yield put( aCreators.requestToLoadUsers() );
  }
}


export function* _(): Gen {
  yield all( [
    takeLatest( aTypes.requestToLoadUsers, onRequestToLoadUsers ),
    takeLatest( aTypes.requestToApproveRegRequest, onRequestToApproveRegRequest ),
  ] );
}
