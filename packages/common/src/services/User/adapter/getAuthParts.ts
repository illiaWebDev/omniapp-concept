import type { UserInDb } from '../core';
import type { AuthData } from '../authParts';


/**
 * - we query by id in validateAuth/validateAuthAndRole
 * - we query by username in login
 *
 * this is the only method, that should return hashed password\
 * as we will use it to check login credentials. No other method\
 * should return password
 */
export type Arg = Partial< Pick< UserInDb, 'id' | 'username' > >;

export type SuccessResp = AuthData & Pick< UserInDb, 'password' >;
export type FailureResp = null;
export type Resp = SuccessResp | FailureResp;
