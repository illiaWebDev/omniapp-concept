import type * as serviceNS from '@omniapp-concept/common/dist/services/User/service';
import type { UserServiceConstructorArg } from '../types';


export type Arg = {
  arg: serviceNS.getListForAdmin.Arg;
  verifyAuth: serviceNS.Service[ 'verifyAuth' ];
  adapter: UserServiceConstructorArg[ 'adp' ];
};

export const _ = async ( arg: Arg ): Promise< serviceNS.getListForAdmin.Resp > => {
  const { arg: argInner, adapter, verifyAuth } = arg;

  const verifyAuthRes = await verifyAuth( { ...argInner, allowedRoles: [ 'admin' ] } );
  if ( verifyAuthRes.success === false ) return verifyAuthRes;

  return {
    success: true,
    data: await adapter.getList(),
  };
};
