import type { ExcludeJwt } from '../authParts';
import type * as approveRegRequestNS from '../service/approveRegRequest';


export const route = '/__user/approveRegRequest';

export type Arg = ExcludeJwt< approveRegRequestNS.Arg >;
export type Resp = approveRegRequestNS.Resp;
