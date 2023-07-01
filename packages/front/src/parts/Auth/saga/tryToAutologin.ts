import { call, put } from 'redux-saga/effects';
import * as userRoutesNS from '@omniapp-concept/common/dist/services/User/routes';
import { fetchSaga } from '@utils/fetchSaga';
import type { JWTStr } from '@omniapp-concept/common/dist/services/User/authParts';
import { aCreators } from '../reducer';


// ===================================================================================

export type TryToAutologinSagaArg = {
  jwt: string | null;
};
/**
 * STEP 1 (app starts bootstrapping from here)
 * basically we start doing something because of this guy\
 * that triggers right on mount.\
 * IMPORTANT 2: we export this because it is to be used\
 * as a standalone saga in sagaMiddleware.run, and that\
 * is because for different platforms we will potentially\
 * use different bootstrap methods: for browser - initial\
 * state of the navigation bar, for react-native - smth\
 * else, etc. That's why jwt is a parameter of this function.
 */
export function* tryToAutologinSaga( { jwt }: TryToAutologinSagaArg ) {
  type Rtrn = Parameters< typeof aCreators.setAutologinAttempted >[ 0 ];

  const rtrn: Rtrn = yield call( function* tryToAutologinInner(): Generator< unknown, Rtrn, unknown > {
    if ( jwt === null ) return null;

    const resp = ( yield call(
      fetchSaga,
      { path: userRoutesNS.getMe.route, jwtOverrideForAutologin: jwt },
    ) ) as userRoutesNS.getMe.Resp;

    return resp.success === false ? null : { jwtToken: jwt as JWTStr, user: resp.data };
  } );

  yield put( aCreators.setAutologinAttempted( rtrn ) );
}
