import { compare } from 'bcrypt';
import * as serviceNS from '@omniapp-concept/common/dist/services/User/service';
import type { UserServiceConstructorArg } from '../types';
import { getJwt } from '../__getJwt';
import type * as envVarsNS from '../../../../utlis/envVariables';


export type Arg = {
  arg: serviceNS.login.Arg;
  adapter: UserServiceConstructorArg[ 'adp' ];
  jwtSecret: envVarsNS.Rtrn[ 'JWT_SECRET' ];
  jwtExpiresIn: envVarsNS.Rtrn[ 'JWT_EXPIRES_IN' ];
};
export const _ = async ( arg: Arg ): Promise< serviceNS.login.Resp > => {
  const {
    arg: { password, username },
    adapter,
    jwtExpiresIn,
    jwtSecret,
  } = arg;

  const result: serviceNS.login.Resp = await ( async () => {
    const maybeAuthParts = await adapter.getAuthParts( { username } );
    if ( maybeAuthParts === null ) return serviceNS.login.INVALID_LOGIN_OR_PASSWORD_RESP;


    const isPasswordCorrect = await compare( password, maybeAuthParts.password );
    if ( !isPasswordCorrect ) return serviceNS.login.INVALID_LOGIN_OR_PASSWORD_RESP;

    const user = await adapter.get( { username, status: 'registered' } );
    if ( user === null ) return serviceNS.login.INVALID_LOGIN_OR_PASSWORD_RESP;

    const result: serviceNS.login.Resp = {
      success: true,
      data: {
        jwt: getJwt( {
          id: maybeAuthParts.id,
          jwtExpiresIn,
          jwtSecret,
        } ),
        user,
      },
    };

    return result;
  } )();

  return result;
};
