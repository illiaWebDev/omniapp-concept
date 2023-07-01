import decodeJwtFromLib from 'jwt-decode';
import type { JWTStr as JWTStrFromLib } from '@illia-web-dev/types/dist/types/jwt';
import type { BrandOf, NominalHardStrT } from '@illia-web-dev/types/dist/core';
import type { EpochSecond } from '@illia-web-dev/types/dist/types/Time/Time';
import type { SafeOmit } from '@illia-web-dev/types/dist/types/Omit';
import type { TFailureRes, TSuccessRes } from '@illia-web-dev/types/dist/types';
import type { UserInDb, UserRoleT } from './core';


export const JWT_LOCAL_STORAGE_KEY = 'omniapp-jwt-key';

// used in payload of jwt tokens as a quick way to make some judgments
// based on id, or revoke token if expiration date is near (or decide
// if nbf - not before - is in the future, or jti - if jwt id is revoked, etc)
export type JwtPayload = {
  sub: UserInDb[ 'id' ];
  exp: EpochSecond;
  iat: EpochSecond;
};
export type JWTStr = NominalHardStrT< keyof BrandOf< JWTStrFromLib > | 'withJwtPayload' >;
export const decodeJWT = ( jwt: JWTStr ): JwtPayload => decodeJwtFromLib( jwt );


export type WithJwt = { jwt?: string };
export type ExcludeJwt< T extends WithJwt > = SafeOmit< T, 'jwt' >;

// ===================================================================================

/**
 * holds user related info that will typically be used for\
 * RBAC or maybe some advanced id validation (like get only \
 * products created by this userId)
 */
export type AuthData = Pick< UserInDb, 'id' | 'role' >;
export type WithAuthData = { authData: AuthData };


// ===================================================================================
// we define all related VerifyAuth args and results because other
// services will reuse this info, and I don't want them to go inside
// verifyAuth/verifyAuthAndRole methods, better import from somewhere
// more general

export type VerifyAuthArg = WithJwt & { allowedRoles?: UserRoleT[] };

export type VerifyAuthSuccessRes = TSuccessRes< WithAuthData & { jwtPayload: JwtPayload } >;

export type VerifyAuthFailureRes = TFailureRes< 'invalidAuth' | 'expiredAuth' | 'notAllowed' >;

export const verifyAuthInvalidRes: VerifyAuthFailureRes = { success: false, error: 'invalidAuth' };
export const verifyAuthExpiredRes: VerifyAuthFailureRes = { success: false, error: 'expiredAuth' };
export const verifyAuthNotAllowedRes: VerifyAuthFailureRes = { success: false, error: 'notAllowed' };


export type VerifyAuthRes = VerifyAuthSuccessRes | VerifyAuthFailureRes;
