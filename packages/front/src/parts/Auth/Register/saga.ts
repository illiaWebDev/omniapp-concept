import type { BeforeNavigateSaga } from '@utils/location/__locationUnion_helpers';
import { call } from 'redux-saga/effects';
import { matchesReduxLocation } from './locationHelpers';
import { navigateToMainIfLoggedInSaga, NavigateToMainIfLoggedInSagaRtrn } from '../saga/navigateToMainIfLoggedIn';


export const beforeNavigate: BeforeNavigateSaga = function* ( l ) {
  if ( !matchesReduxLocation( l ) ) return 'noOverrideHappened';

  const rtrn: NavigateToMainIfLoggedInSagaRtrn = yield call( navigateToMainIfLoggedInSaga );
  return rtrn;
};
