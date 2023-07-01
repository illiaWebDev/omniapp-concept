import type { TFailureRes, TSuccessRes } from '@illia-web-dev/types/dist/types/CommonRes';
import type { props, UserInDb, UserOutOfDb } from '../core';
import type { JWTStr } from '../authParts';

/**
 * - has corresponding route
 * - utilizes UserService.verifyAuth
 * - after successful verification uses UserAdapter.get
 */
export type Arg = Pick< UserInDb, 'username' > & { [ props.password ]: string };

export type Resp = (
  | TSuccessRes< { jwt: JWTStr; user: UserOutOfDb } >
  | TFailureRes< 'invalidLoginOrPassword' >
);

export const INVALID_LOGIN_OR_PASSWORD_RESP: Resp = { success: false, error: 'invalidLoginOrPassword' };
