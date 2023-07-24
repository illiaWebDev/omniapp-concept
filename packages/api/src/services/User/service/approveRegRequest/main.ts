import type * as serviceNS from '@omniapp-concept/common/dist/services/User/service';
import { tSuccessRes } from '@illia-web-dev/types/dist/types/CommonRes';
import type { UserServiceConstructorArg } from '../types';
import { addWithHistory } from '../../../__common';


export type Arg = {
  arg: serviceNS.approveRegRequest.Arg;
  adapter: UserServiceConstructorArg[ 'adp' ];
  verifyAuth: serviceNS.Service[ 'verifyAuth' ];
};

export const _ = async ( arg: Arg ): Promise< serviceNS.approveRegRequest.Resp > => {
  const {
    arg: { id, jwt },
    verifyAuth,
    adapter,
  } = arg;

  const verifyRes = await verifyAuth( { jwt, allowedRoles: [ 'admin' ] } );
  if ( verifyRes.success === false ) return verifyRes;

  await adapter.patch( {
    id,
    data: {
      ...addWithHistory( {}, verifyRes.data.authData.id ),
      status: 'registered',
    },
  } );

  return tSuccessRes;
};
