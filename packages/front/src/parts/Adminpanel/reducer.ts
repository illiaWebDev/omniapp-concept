import type { ACreators } from '@illia-web-dev/types/dist/types/ACreators';
import type { RecordValues } from '@illia-web-dev/types/dist/types/RecordValues';
// import type * as loginRouteNS from '@omniapp-concept/common/dist/services/User/routes/login';
// import type { JWTStr } from '@omniapp-concept/common/dist/services/User/authParts';
import type { UserOutOfDb } from '@omniapp-concept/common/dist/services/User/core';
import type * as routesNS from '@omniapp-concept/common/dist/services/User/routes';


export const REDUX_PROP = 'adminpanel';
export type State = {
  users: UserOutOfDb[];
};
export const defaultState: State = {
  users: [],
};

export const aTypes = {
  setUsers: 'admin/setUsers',
  requestToLoadUsers: 'admin/requestToLoadUsers',

  requestToApproveRegRequest: 'admin/requestToApproveRegRequest',
} as const;


export type Actions = {
  setUsers: {
    type: typeof aTypes.setUsers;
    payload: State[ 'users' ];
  };
  requestToLoadUsers: {
    type: typeof aTypes.requestToLoadUsers;
  };

  requestToApproveRegRequest: {
    type: typeof aTypes.requestToApproveRegRequest;
    payload: routesNS.approveRegRequest.Arg;
  };
};
export type AllActions = RecordValues< Actions >;


export const aCreators: ACreators< Actions > = {
  setUsers: p => ( { type: aTypes.setUsers, payload: p } ),
  requestToLoadUsers: () => ( { type: aTypes.requestToLoadUsers } ),
  requestToApproveRegRequest: p => ( { type: aTypes.requestToApproveRegRequest, payload: p } ),
};


export function _( s = defaultState, a: AllActions ): typeof s {
  switch ( a.type ) {
    case aTypes.setUsers:
      return {
        ...s,
        users: a.payload,
      };

    default: return s;
  }
}
