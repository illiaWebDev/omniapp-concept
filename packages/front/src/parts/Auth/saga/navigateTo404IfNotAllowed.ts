import type { UserRoleT } from '@omniapp-concept/common/dist/services/User/core';
// import { decodeJWT } from '@omniapp-concept/common/dist/services/User/authParts';
import * as locationReducerNS from '@utils/location/reducer';
import type { BeforeNavigateSagaRtrn } from '@utils/location/__locationUnion_helpers';
import type { RootState } from '@utils/stores/redux_constants';
import { put, select } from 'redux-saga/effects';
import * as Location404NS from '../../404/locationT';


export type NavigateTo404IfNotAllowedSagaRtrn = BeforeNavigateSagaRtrn;
/**
 * is used to lie a little bit and show 404 if user is not allowed\
 * to see some route. Returns true if override happended, false\
 * otherwise.
 */
export function* navigateTo404IfNotAllowedSaga(
  allowedRoles: UserRoleT[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Generator< unknown, NavigateTo404IfNotAllowedSagaRtrn, any > {
  const { auth: { data } }: RootState = yield select();

  if ( data !== null ) {
    const { role } = data.user;
    const hasAllowedRole = allowedRoles.some( allowedRole => role.indexOf( allowedRole ) !== -1 );

    if ( hasAllowedRole ) return 'noOverrideHappened';
  }


  yield put( locationReducerNS.aCreators.requestToSetLocation( {
    state: Location404NS.state,
    isOverride: true,
    replace: true,
  } ) );

  return 'overrideHappened';
}
