import type { BeforeNavigateSaga } from '@utils/location/__locationUnion_helpers';
import { call } from 'redux-saga/effects';
import { matchesReduxLocation } from './locationHelpers';
import { NavigateToLoginIfUnauthedSaga, NavigateToLoginIfUnauthedSagaRtrn } from '../Auth/saga/navigateToLoginIfUnauthed';


export const beforeNavigate: BeforeNavigateSaga = function* beforeNavigateMain( state ) {
  if ( !matchesReduxLocation( state ) ) return 'noOverrideHappened';

  const resp: NavigateToLoginIfUnauthedSagaRtrn = yield call( NavigateToLoginIfUnauthedSaga );
  return resp;
};
