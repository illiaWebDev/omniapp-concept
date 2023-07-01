import {
  all,
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import * as userRoutesNS from '@omniapp-concept/common/dist/services/User/routes';
import * as ToastifyNS from '@utils/stores/toastify_saga';
import { fetchSaga } from '@utils/fetchSaga';
import * as locationReducerNS from '@utils/location/reducer';
import { aCreators, Actions, aTypes } from '../reducer';
import { state as loginLocationState } from '../Login/locationT';
import * as mainLocationNS from '../../Main/locationT';


function* onRequestToLogout(): Gen {
  yield put( aCreators.setData( null ) );
  yield put( locationReducerNS.aCreators.requestToSetLocation( {
    state: loginLocationState,
  } ) );
}


// ===================================================================================


function* onRequestToLogin( a: Actions[ 'requestToLogin' ] ): Gen {
  const body: userRoutesNS.login.Arg = a.payload.data;

  const resp: userRoutesNS.login.Resp = yield call(
    fetchSaga,
    { path: userRoutesNS.login.route, body },
  );

  if ( resp.success === false ) {
    yield put( ToastifyNS.aCreators.showToast( {
      text: 'Невірний логін/пароль',
      type: 'error',
    } ) );

    return;
  }

  const { jwt, user } = resp.data;

  yield put( aCreators.setData( { jwtToken: jwt, user } ) );
  yield put( locationReducerNS.aCreators.requestToSetLocation( {
    state: mainLocationNS.state,
  } ) );
}

// ===================================================================================

function* onRequestToRegister( a: Actions[ 'requestToRegister' ] ): Gen {
  // yield void a;
  const body: userRoutesNS.register.Arg = a.payload.data;

  const resp: userRoutesNS.register.Resp = yield call(
    fetchSaga,
    { path: userRoutesNS.register.route, body },
  );
  void resp;

  yield put( ToastifyNS.aCreators.showToast( {
    text: 'Запит на реєстрацію створено',
    type: 'success',
  } ) );
}


export function* _(): Gen {
  yield all( [
    takeLatest( aTypes.requestToLogout, onRequestToLogout ),
    takeLatest( aTypes.requestToLogin, onRequestToLogin ),
    takeLatest( aTypes.requestToRegister, onRequestToRegister ),
  ] );
}
