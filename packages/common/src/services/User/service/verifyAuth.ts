import type { VerifyAuthRes, VerifyAuthArg } from '../authParts';

/**
 * - does not have corresponding route
 * - used when attempting reauth (as a part of getMe)
 * - used in other services to make sure that it is\
 * allowed to do certain operation
 */
export type Arg = VerifyAuthArg;
export type Resp = VerifyAuthRes;
