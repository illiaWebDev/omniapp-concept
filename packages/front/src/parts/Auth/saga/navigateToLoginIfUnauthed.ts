import { put, select } from 'redux-saga/effects';
import * as locationReducerNS from '@utils/location/reducer';
import type { BeforeNavigateSagaRtrn } from '@utils/location/__locationUnion_helpers';
import type { RootState } from '@utils/stores/redux_constants';
import * as loginLocationNS from '../Login/locationT';


export type NavigateToLoginIfUnauthedSagaRtrn = BeforeNavigateSagaRtrn;


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* NavigateToLoginIfUnauthedSaga(): Generator< unknown, NavigateToLoginIfUnauthedSagaRtrn, any > {
  const { auth: { data } }: RootState = yield select();
  if ( data !== null ) return 'noOverrideHappened';

  yield put( locationReducerNS.aCreators.requestToSetLocation( {
    state: loginLocationNS.state,
    isOverride: true,
  } ) );

  return 'overrideHappened';
}
