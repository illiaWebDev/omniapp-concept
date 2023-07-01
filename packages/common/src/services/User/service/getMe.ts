import type { TSuccessRes } from '@illia-web-dev/types/dist/types/CommonRes';
import type { UserOutOfDb } from '../core';
import type { WithJwt, VerifyAuthFailureRes } from '../authParts';

/**
 * - has corresponding route
 * - utilizes UserService.verifyAuth
 * - after successful verification uses UserAdapter.get
 */
export type Arg = WithJwt;

export type Resp = (
  | TSuccessRes< UserOutOfDb >
  | VerifyAuthFailureRes
);
