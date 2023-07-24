import type * as serviceNS from '@omniapp-concept/common/dist/services/User/service';
import * as envVarsNS from '../../../utlis/envVariables';
import type { UserServiceConstructorArg } from './types';
import * as createDefaultOnApiStartupNS from './createDefaultOnApiStartup';
import * as verifyAuthNS from './verifyAuth';
import * as getMeNS from './getMe';
import * as loginNS from './login';
import * as registerNS from './register';
import * as getListForAdminNS from './getListForAdmin';
import * as approveRegRequestNS from './approveRegRequest';


export class UserService implements serviceNS.Service {
  __serviceAdapter: UserServiceConstructorArg[ 'adp' ];

  __getServices: UserServiceConstructorArg[ 'getServices' ];


  __defaultUserPassword: envVarsNS.Rtrn[ 'CREATE_DEFAULT_USER_WITH_THIS_PASSWORD' ];


  // ===================================================================================

  __jwtSecret: envVarsNS.Rtrn[ 'JWT_SECRET' ];

  __jwtExpiresIn: envVarsNS.Rtrn[ 'JWT_EXPIRES_IN' ];


  // ===================================================================================

  constructor( { adp, getServices }: UserServiceConstructorArg ) {
    this.__serviceAdapter = adp;
    this.__getServices = getServices;

    const { CREATE_DEFAULT_USER_WITH_THIS_PASSWORD, JWT_SECRET, JWT_EXPIRES_IN } = envVarsNS.getEnvVars();
    this.__defaultUserPassword = CREATE_DEFAULT_USER_WITH_THIS_PASSWORD;
    this.__jwtSecret = JWT_SECRET;
    this.__jwtExpiresIn = JWT_EXPIRES_IN;
  }


  createDefaultOnApiStartup = (): Promise< serviceNS.createDefaultOnApiStartup.Resp > => (
    createDefaultOnApiStartupNS._( {
      adapter: this.__serviceAdapter,
      defaultUserPassword: this.__defaultUserPassword,
    } )
  );

  verifyAuth = ( arg: serviceNS.verifyAuth.Arg ): Promise< serviceNS.verifyAuth.Resp > => (
    verifyAuthNS._( {
      arg,
      adapter: this.__serviceAdapter,
      jwtSecret: this.__jwtSecret,
    } )
  );

  getMe = ( arg: serviceNS.getMe.Arg ): Promise< serviceNS.getMe.Resp > => (
    getMeNS._( {
      adapter: this.__serviceAdapter,
      verifyAuth: this.verifyAuth,
      arg,
    } )
  );

  login = ( arg: serviceNS.login.Arg ): Promise< serviceNS.login.Resp > => (
    loginNS._( {
      adapter: this.__serviceAdapter,
      arg,
      jwtExpiresIn: this.__jwtExpiresIn,
      jwtSecret: this.__jwtSecret,
    } )
  );

  register = ( arg: serviceNS.register.Arg ): Promise< serviceNS.register.Resp > => (
    registerNS._( {
      adapter: this.__serviceAdapter,
      arg,
    } )
  );

  getListForAdmin = ( arg: serviceNS.getListForAdmin.Arg ): Promise< serviceNS.getListForAdmin.Resp > => (
    getListForAdminNS._( {
      adapter: this.__serviceAdapter,
      arg,
      verifyAuth: this.verifyAuth,
    } )
  );

  approveRegRequest = ( arg: serviceNS.approveRegRequest.Arg ): Promise<serviceNS.approveRegRequest.Resp> => (
    approveRegRequestNS._( {
      arg,
      adapter: this.__serviceAdapter,
      verifyAuth: this.verifyAuth,
    } )
  );
}
