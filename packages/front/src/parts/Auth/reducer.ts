import type { ACreators } from '@illia-web-dev/types/dist/types/ACreators';
import type { RecordValues } from '@illia-web-dev/types/dist/types/RecordValues';
import type * as loginRouteNS from '@omniapp-concept/common/dist/services/User/routes/login';
import type { JWTStr } from '@omniapp-concept/common/dist/services/User/authParts';
import type { UserOutOfDb } from '@omniapp-concept/common/dist/services/User/core';


export const REDUX_PROP = 'auth';
export type State = {
  /**
   * to know whether we are "waiting till autologin logic runs" or\
   * we have ran that and can continue with rendering other routes
   */
  isAutologinAttempted: boolean;
  data: null | {
    jwtToken: JWTStr;
    user: UserOutOfDb;
  };
};
export const defaultState: State = {
  isAutologinAttempted: false,
  data: null,
};

export const aTypes = {
  setData: 'auth/setData',

  setAutologinAttempted: 'auth/setAutologinAttempted',

  requestToLogin: 'auth/requestToLogin',
  requestToLogout: 'auth/requestToLogout',

  requestToRegister: 'auth/requestToRegister',
} as const;


export type Actions = {
  setData: {
    type: typeof aTypes.setData;
    payload: State[ 'data' ];
  };
  setAutologinAttempted: {
    type: typeof aTypes.setAutologinAttempted;
    payload: Actions[ 'setData' ][ 'payload' ];
  };

  requestToLogout: {
    type: typeof aTypes.requestToLogout;
  };
  requestToLogin: {
    type: typeof aTypes.requestToLogin;
    payload: {
      data: loginRouteNS.Arg;
    };
  };

  requestToRegister: {
    type: typeof aTypes.requestToRegister;
    payload: {
      data: loginRouteNS.Arg;
    };
  };
};
export type AllActions = RecordValues< Actions >;


export const aCreators: ACreators< Actions > = {
  setData: p => ( { type: aTypes.setData, payload: p } ),
  setAutologinAttempted: p => ( { type: aTypes.setAutologinAttempted, payload: p } ),
  requestToLogout: () => ( { type: aTypes.requestToLogout } ),
  requestToLogin: p => ( { type: aTypes.requestToLogin, payload: p } ),
  requestToRegister: p => ( { type: aTypes.requestToRegister, payload: p } ),
};


export function _( s = defaultState, a: AllActions ): typeof s {
  switch ( a.type ) {
    case aTypes.setData:
      return {
        ...s,
        data: a.payload,
      };
    case aTypes.setAutologinAttempted: {
      const stateWithAutologinTrue: typeof s = {
        ...s,
        isAutologinAttempted: true,
      };

      return _(
        stateWithAutologinTrue,
        aCreators.setData( a.payload ),
      );
    }

    default: return s;
  }
}
