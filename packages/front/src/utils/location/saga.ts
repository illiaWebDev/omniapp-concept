import {
  all,
  put,
  takeLatest,
  call,
} from 'redux-saga/effects';
import { Actions, aTypes, aCreators } from './reducer';
import type { BeforeNavigateSagaRtrn } from './__locationUnion_helpers';
import * as LoginSagaNS from '../../parts/Auth/Login/saga';
import * as RegisterSagaNS from '../../parts/Auth/Register/saga';
import * as MainSagaNS from '../../parts/Main/saga';
import * as AdminSagaNS from '../../parts/Adminpanel/saga';


// ===================================================================================


export function* saga(): Gen {
  yield all( [
    takeLatest( aTypes.requestToSetLocation, function* onRequestToNavigate( a: Actions[ 'requestToSetLocation' ] ) {
      const { state, replace } = a.payload;

      const beforeNavigateResults: BeforeNavigateSagaRtrn[] = yield all( [
        call( LoginSagaNS.beforeNavigate, state ),
        call( RegisterSagaNS.beforeNavigate, state ),
        call( MainSagaNS.beforeNavigate, state ),
        call( AdminSagaNS.beforeNavigate, state ),
      ] );

      const controlWasOverridden = beforeNavigateResults.some( it => it === 'overrideHappened' );
      /**
       * if some beforeNavigate saga took control and returned non-null\
       * response - we cannot proceed here and should just bail out
       */
      if ( controlWasOverridden ) return;

      yield put( aCreators.setLocation( { state, replace } ) );
    } ),
  ] );
}
