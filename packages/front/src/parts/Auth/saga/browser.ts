import { JWT_LOCAL_STORAGE_KEY } from '@omniapp-concept/common/dist/services/User/authParts';
import { takeLatest } from 'redux-saga/effects';
import { aTypes, Actions } from '../reducer';


export function* _(): Gen {
  yield takeLatest( aTypes.setData, ( { payload }: Actions[ 'setData' ] ) => {
    if ( payload ) localStorage.setItem( JWT_LOCAL_STORAGE_KEY, payload.jwtToken );
    else localStorage.removeItem( JWT_LOCAL_STORAGE_KEY );
  } );
}
