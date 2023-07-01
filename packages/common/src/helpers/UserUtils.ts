import type { NominalHardStrT } from '@illia-web-dev/types/dist/core';
import { nanoid, NanoIdTConst } from './nanoid';


// defined here because user files and WithHistory utils
// will import it
export type UserId = NominalHardStrT< NanoIdTConst | 'UserId' >;
export const getUserId = () => `u_${ nanoid() }` as UserId;
export const USER_ID_REGEX = /u_.{10}/;
