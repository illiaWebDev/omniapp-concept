import { hash, compare } from 'bcrypt';
import jwtLib from 'jsonwebtoken';
import ms from 'ms';
import type { BcryptPassword } from '@illia-web-dev/types/dist/types/BcryptPassword';
import { getUserId, UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import * as serviceNS from '@omniapp-concept/common/dist/services/User/service';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import * as CoreNS from '@omniapp-concept/common/dist/services/User/core';
import * as AuthPartsNS from '@omniapp-concept/common/dist/services/User/authParts';
import { usernameForDefaultUser } from '@omniapp-concept/common/dist/services/User/core';
import { getEpochSecond, type EpochSecond } from '@illia-web-dev/types/dist/types/Time/Time';
import type { GetServices } from '@omniapp-concept/common/dist/services';
import type { SafeOmit } from '@illia-web-dev/types/dist/types/Omit';
import type { HistoryProps } from '@omniapp-concept/common/dist/services/_common/WithHistory';
import { tSuccessRes } from '@illia-web-dev/types/dist/types/CommonRes';
import { addWithHistory } from '../__common';
import * as envVarsNS from '../../utlis/envVariables';
import { logger } from '../../utlis/logger';


const { verifyAuthExpiredRes, verifyAuthNotAllowedRes, verifyAuthInvalidRes } = AuthPartsNS;

export type UserServiceConstructorArg = {
  adp: adapterNS.Adapter;
  getServices: GetServices;
};

type HydrateUser = (
  arg: {
    userData: (
      & SafeOmit<
        CoreNS.UserInDb,
        | CoreNS.UserDbOnlyFields
        | HistoryProps
        | typeof CoreNS.props.id
      >
      & { [ CoreNS.props.password ]: string }
    );
    authorId: UserId | null;
  }
) => Promise< CoreNS.UserInDb >;
export class UserService implements serviceNS.Service {
  __serviceAdapter: UserServiceConstructorArg[ 'adp' ];

  __getServices: UserServiceConstructorArg[ 'getServices' ];


  __defaultUserPassword: envVarsNS.Rtrn[ 'CREATE_DEFAULT_USER_WITH_THIS_PASSWORD' ];


  // ===================================================================================

  __jwtSecret: envVarsNS.Rtrn[ 'JWT_SECRET' ];

  __jwtExpiresIn: envVarsNS.Rtrn[ 'JWT_EXPIRES_IN' ];


  __getJwt = ( id: UserId ): AuthPartsNS.JWTStr => {
    const { __jwtSecret, __jwtExpiresIn } = this;

    const iat = getEpochSecond();
    const data: AuthPartsNS.JwtPayload = {
      sub: id,
      exp: iat + Math.floor( ms( __jwtExpiresIn ) / 1_000 ) as EpochSecond,
      iat,
    };

    return jwtLib.sign( data, __jwtSecret ) as AuthPartsNS.JWTStr;
  };

  // ===================================================================================

  // eslint-disable-next-line class-methods-use-this
  __hydrateUser: HydrateUser = async ( { userData, authorId } ) => {
    const user: CoreNS.UserInDb = {
      id: getUserId(),
      ...addWithHistory( {}, authorId ),
      ...userData,
      password: ( await hash( userData.password, CoreNS.SALT_ROUNDS ) ) as BcryptPassword,
    };

    return user;
  };

  // ===================================================================================

  constructor( { adp, getServices }: UserServiceConstructorArg ) {
    this.__serviceAdapter = adp;
    this.__getServices = getServices;

    const { CREATE_DEFAULT_USER_WITH_THIS_PASSWORD, JWT_SECRET, JWT_EXPIRES_IN } = envVarsNS.getEnvVars();
    this.__defaultUserPassword = CREATE_DEFAULT_USER_WITH_THIS_PASSWORD;
    this.__jwtSecret = JWT_SECRET;
    this.__jwtExpiresIn = JWT_EXPIRES_IN;
  }

  async createDefaultOnApiStartup(): Promise< serviceNS.createDefaultOnApiStartup.Resp > {
    const defaultUserPassword = this.__defaultUserPassword;
    if ( defaultUserPassword === undefined ) {
      return false;
    }


    logger.log( { level: 'debug', tags: [ 'user', 'createDefaultOnApiStartup' ] } );
    const adapter = this.__serviceAdapter;

    const maybeDefaultUser = await adapter.get( { username: usernameForDefaultUser } );
    if ( maybeDefaultUser !== null ) return false;


    const defaultUser: adapterNS.create.Arg = await this.__hydrateUser( {
      authorId: null,
      userData: {
        username: usernameForDefaultUser,
        role: [ CoreNS.UserRole.admin, CoreNS.UserRole.powerUser, CoreNS.UserRole.user ],
        password: defaultUserPassword,
        status: 'registered',
      },
    } );

    return adapter.create( defaultUser );
  }


  async verifyAuth( { jwt, allowedRoles }: serviceNS.verifyAuth.Arg ): Promise< serviceNS.verifyAuth.Resp > {
    if ( jwt === undefined ) return verifyAuthInvalidRes;

    try {
      const payload = jwtLib.verify( jwt, this.__jwtSecret );
      if ( typeof payload === 'string' ) return verifyAuthInvalidRes;

      const typedPayload = payload as AuthPartsNS.JwtPayload;

      const maybeAuthData = await this.__serviceAdapter.getAuthParts( {
        type: 'id',
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
  }

  async getMe( arg: serviceNS.getMe.Arg ): Promise< serviceNS.getMe.Resp > {
    const verifyAuthRes = await this.verifyAuth( arg );
    if ( verifyAuthRes.success === false ) return verifyAuthRes;

    const { id } = verifyAuthRes.data.authData;
    const data = await this.__serviceAdapter.get( { id, status: 'registered' } );
    // this should be impossible but whatever
    if ( data === null ) return verifyAuthInvalidRes;

    return {
      success: true,
      data,
    };
  }

  async login( arg: serviceNS.login.Arg ): Promise< serviceNS.login.Resp > {
    const { password, username } = arg;

    const result: serviceNS.login.Resp = await ( async () => {
      const adapter = this.__serviceAdapter;

      const maybeAuthParts = await adapter.getAuthParts( {
        type: 'username',
        username,
      } );
      if ( maybeAuthParts === null ) return serviceNS.login.INVALID_LOGIN_OR_PASSWORD_RESP;


      const isPasswordCorrect = await compare( password, maybeAuthParts.password );
      if ( !isPasswordCorrect ) return serviceNS.login.INVALID_LOGIN_OR_PASSWORD_RESP;

      const user = await adapter.get( { username, status: 'registered' } );
      if ( user === null ) return serviceNS.login.INVALID_LOGIN_OR_PASSWORD_RESP;

      const result: serviceNS.login.Resp = {
        success: true,
        data: {
          jwt: this.__getJwt( maybeAuthParts.id ),
          user,
        },
      };

      return result;
    } )();

    return result;
  }

  async register( { password, username }: serviceNS.register.Arg ): Promise< serviceNS.register.Resp > {
    const regRequestUser: CoreNS.UserInDb = await this.__hydrateUser( {
      authorId: null,
      userData: {
        password,
        username,
        role: [ 'user' ],
        status: 'registrationRequest',
      },
    } );

    await this.__serviceAdapter.create( regRequestUser );

    return { success: true, data: 'registrationRequestCreated' };
  }

  async getListForAdmin( arg: serviceNS.getListForAdmin.Arg ): Promise< serviceNS.getListForAdmin.Resp > {
    const verifyAuthRes = await this.verifyAuth( { ...arg, allowedRoles: [ 'admin' ] } );
    if ( verifyAuthRes.success === false ) return verifyAuthRes;

    return {
      success: true,
      data: await this.__serviceAdapter.getList(),
    };
  }

  async approveRegRequest( { jwt, id }: serviceNS.approveRegRequest.Arg ): Promise<serviceNS.approveRegRequest.Resp> {
    const verifyRes = await this.verifyAuth( { jwt, allowedRoles: [ 'admin' ] } );
    if ( verifyRes.success === false ) return verifyRes;

    await this.__serviceAdapter.patch( {
      id,
      data: {
        ...addWithHistory( {}, verifyRes.data.authData.id ),
        status: 'registered',
      },
    } );

    return tSuccessRes;
  }
}
