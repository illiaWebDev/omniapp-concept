import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all, call } from 'redux-saga/effects';
import { JWT_LOCAL_STORAGE_KEY } from '@omniapp-concept/common/dist/services/User/authParts';
import * as AuthNS from '../../parts/Auth';
import * as AdminNS from '../../parts/Adminpanel';
import * as LocationNS from '../location';
import type { RootState } from './redux_constants';
import * as ToastifyNS from './toastify_saga';
import { NODE_ENV } from '../envVariables';
import { history } from '../history';


const sagaMiddleware = createSagaMiddleware();


const rootReducer = combineReducers< RootState >( {
  [ AuthNS.reducer.REDUX_PROP ]: AuthNS.reducer._,
  [ LocationNS.REDUX_PROP ]: LocationNS.reducer,
  [ AdminNS.reducer.REDUX_PROP ]: AdminNS.reducer._,
} );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const windowAny = window as any;
const middlewares = applyMiddleware( sagaMiddleware );

const enhancer = ( NODE_ENV !== 'production' && windowAny.__REDUX_DEVTOOLS_EXTENSION__ )
  ? compose(
    middlewares,
    windowAny.__REDUX_DEVTOOLS_EXTENSION__(),
  )
  : compose( middlewares );

export const store = createStore( rootReducer, enhancer );


sagaMiddleware.run( function* rootSaga() {
  yield all( [
    call( ToastifyNS.saga ),

    call( AuthNS.saga._ ),
    call( AuthNS.sagaBrowser._ ),

    call( AdminNS.saga._ ),

    call( LocationNS.saga ),
    call( LocationNS.sagaBrowser ),
    call( LocationNS.bootstrapFromRouteSaga, history.location.pathname ),


    call(
      AuthNS.tryToAutologinSaga,
      { jwt: localStorage.getItem( JWT_LOCAL_STORAGE_KEY ) },
    ),
  ] );
} );
