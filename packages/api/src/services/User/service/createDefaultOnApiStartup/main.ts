import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import type * as serviceNS from '@omniapp-concept/common/dist/services/User/service';
import * as CoreNS from '@omniapp-concept/common/dist/services/User/core';
import { usernameForDefaultUser } from '@omniapp-concept/common/dist/services/User/core';
import { logger } from '../../../../utlis/logger';
import { HydrateUser, UserServiceConstructorArg } from '../types';


export type Arg = {
  defaultUserPassword: string;
  adapter: UserServiceConstructorArg[ 'adp' ];
  hydrateUser: HydrateUser;
};

export const _ = async ( arg: Arg ): Promise< serviceNS.createDefaultOnApiStartup.Resp > => {
  const { defaultUserPassword, adapter, hydrateUser } = arg;

  logger.log( { level: 'debug', tags: [ 'user', 'createDefaultOnApiStartup' ] } );

  const maybeDefaultUser = await adapter.get( { username: usernameForDefaultUser } );
  if ( maybeDefaultUser !== null ) return false;


  const defaultUser: adapterNS.create.Arg = await hydrateUser( {
    authorId: null,
    userData: {
      username: usernameForDefaultUser,
      role: [ CoreNS.UserRole.admin, CoreNS.UserRole.powerUser, CoreNS.UserRole.user ],
      password: defaultUserPassword,
      status: 'registered',
    },
  } );

  return adapter.create( defaultUser );
};
