import type { TSuccessRes } from '@illia-web-dev/types/dist/types';
import type { WithJwt, VerifyAuthFailureRes } from '../authParts';
import type * as getList from '../adapter/getList';


export type Arg = WithJwt;
export type Resp = VerifyAuthFailureRes | TSuccessRes< getList.Resp >;
