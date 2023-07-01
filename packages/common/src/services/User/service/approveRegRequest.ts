import type { TSuccessRes } from '@illia-web-dev/types/dist/types';
import type * as adapterNS from '../adapter/patch';
import type { VerifyAuthFailureRes, WithJwt } from '../authParts';


export type Arg = WithJwt & Pick< adapterNS.Arg, 'id' >;
export type Resp = (
  | VerifyAuthFailureRes
  | TSuccessRes
);
