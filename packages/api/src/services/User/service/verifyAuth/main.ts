import jwtLib from 'jsonwebtoken';
import type * as serviceNS from '@omniapp-concept/common/dist/services/User/service';
import * as CoreNS from '@omniapp-concept/common/dist/services/User/core';
import * as AuthPartsNS from '@omniapp-concept/common/dist/services/User/authParts';
import type * as envVarsNS from '../../../../utlis/envVariables';
import type { UserServiceConstructorArg } from '../types';


const { verifyAuthExpiredRes, verifyAuthNotAllowedRes, verifyAuthInvalidRes } = AuthPartsNS;

export type Arg = {
  jwtSecret: envVarsNS.Rtrn[ 'JWT_SECRET' ];
  arg: serviceNS.verifyAuth.Arg;
  adapter: UserServiceConstructorArg[ 'adp' ];
};

export const _ = async ( arg: Arg ): Promise< serviceNS.verifyAuth.Resp > => {
  const {
    arg: { jwt, allowedRoles },
    jwtSecret,
    adapter,
  } = arg;

  if ( jwt === undefined ) return verifyAuthInvalidRes;

  try {
    const payload = jwtLib.verify( jwt, jwtSecret );
    if ( typeof payload === 'string' ) return verifyAuthInvalidRes;

    const typedPayload = payload as AuthPartsNS.JwtPayload;

    const maybeAuthData = await adapter.getAuthParts( {
      id: typedPayload.sub,
    } );
    if ( maybeAuthData === null ) return verifyAuthInvalidRes;

    const sucessResp: AuthPartsNS.VerifyAuthSuccessRes = {
      success: true,
      data: {
        jwtPayload: typedPayload,
        authData: { id: maybeAuthData.id, role: maybeAuthData.role },
      },
    };

    if ( allowedRoles === undefined ) return sucessResp;


    return CoreNS.matchesAllowedRole( allowedRoles, sucessResp.data.authData.role )
      ? sucessResp
      : verifyAuthNotAllowedRes;
  } catch ( e ) {
    return e instanceof jwtLib.TokenExpiredError
      ? verifyAuthExpiredRes
      : verifyAuthInvalidRes;
  }
};
