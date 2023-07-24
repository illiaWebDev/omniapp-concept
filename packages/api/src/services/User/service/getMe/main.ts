import type * as serviceNS from '@omniapp-concept/common/dist/services/User/service';
import * as AuthPartsNS from '@omniapp-concept/common/dist/services/User/authParts';
import type { UserServiceConstructorArg } from '../types';


const { verifyAuthInvalidRes } = AuthPartsNS;

export type Arg = {
  arg: serviceNS.getMe.Arg;
  verifyAuth: serviceNS.Service[ 'verifyAuth' ];
  adapter: UserServiceConstructorArg[ 'adp' ];
};
export const _ = async ( arg: Arg ): Promise< serviceNS.getMe.Resp > => {
  const { verifyAuth, adapter, arg: argInner } = arg;

  const verifyAuthRes = await verifyAuth( argInner );
  if ( verifyAuthRes.success === false ) return verifyAuthRes;

  const { id } = verifyAuthRes.data.authData;
  const data = await adapter.get( { id, status: 'registered' } );

  // this should be impossible but whatever
  if ( data === null ) return verifyAuthInvalidRes;

  return {
    success: true,
    data,
  };
};
