import jwtLib from 'jsonwebtoken';
import ms from 'ms';
import type * as AuthPartsNS from '@omniapp-concept/common/dist/services/User/authParts';
import { getEpochSecond, EpochSecond } from '@illia-web-dev/types/dist/types/Time/Time';
import type { UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import type * as envVarsNS from '../../../../utlis/envVariables';


export type GetJwtArg = {
  id: UserId;
  jwtSecret: envVarsNS.Rtrn[ 'JWT_SECRET' ];
  jwtExpiresIn: envVarsNS.Rtrn[ 'JWT_EXPIRES_IN' ];
};
export type GetJwt = ( arg: GetJwtArg ) => AuthPartsNS.JWTStr;


export const getJwt: GetJwt = arg => {
  const { id, jwtExpiresIn, jwtSecret } = arg;

  const iat = getEpochSecond();
  const data: AuthPartsNS.JwtPayload = {
    sub: id,
    exp: iat + Math.floor( ms( jwtExpiresIn ) / 1_000 ) as EpochSecond,
    iat,
  };

  return jwtLib.sign( data, jwtSecret ) as AuthPartsNS.JWTStr;
};
