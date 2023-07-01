import type { TSuccessRes } from '@illia-web-dev/types/dist/types';
import type { UserInDb, props } from '../core';


export type Arg = Pick< UserInDb, 'username' > & { [ props.password ]: string };
export type Resp = TSuccessRes< 'registrationRequestCreated' >;
