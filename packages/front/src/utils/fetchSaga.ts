import { select } from 'redux-saga/effects';
import { API_URL_FROM_BROWSER } from './envVariables';
import type { RootState } from './stores/redux_constants';


export type FetchSagaArg = {
  /** path to query in API server (i.e. "/_jwt/get" ) */
  path: string;
  body?: Record< string, unknown >;
  /**
   * used in one and only place: during autologin. In general\
   * this saga will extract jwt from redux store (as we want to\
   * be as redux-centric as possible) but when we do the reauth\
   * jwt in store is obviously not valid, so we will override\
   * that using this parameter but ONLY in that single place.\
   * All other places should use typical extract logic from\
   * store.
   */
  jwtOverrideForAutologin?: string;
};
export function* fetchSaga( { path, body, jwtOverrideForAutologin }: FetchSagaArg ): Gen {
  const { auth: { data } }: RootState = yield select();
  const effectiveJwt = jwtOverrideForAutologin || ( data && data.jwtToken );

  const rtrn = yield fetch( `${ API_URL_FROM_BROWSER }${ path }`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...( effectiveJwt === null ? {} : { Authorization: `Bearer ${ effectiveJwt }` } ),
    },
    body: JSON.stringify( body || {} ),
  } )
    .then( r => r.json() );

  return rtrn;
}
