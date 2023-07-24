import type * as serviceNS from '@omniapp-concept/common/dist/services/User/service';
import type * as CoreNS from '@omniapp-concept/common/dist/services/User/core';
import type { UserServiceConstructorArg } from '../types';
import { hydrateUser } from '../__hydrateUser';


export type Arg = {
  arg: serviceNS.register.Arg;
  adapter: UserServiceConstructorArg[ 'adp' ];
};
export const _ = async ( arg: Arg ): Promise< serviceNS.register.Resp > => {
  const {
    arg: { password, username },
    adapter,
  } = arg;

  const regRequestUser: CoreNS.UserInDb = await hydrateUser( {
    authorId: null,
    userData: {
      password,
      username,
      role: [ 'user' ],
      status: 'registrationRequest',
    },
  } );

  await adapter.create( regRequestUser );

  return { success: true, data: 'registrationRequestCreated' };
};
