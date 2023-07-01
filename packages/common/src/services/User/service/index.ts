import type * as createDefaultOnApiStartup from './createDefaultOnApiStartup';
import type * as verifyAuth from './verifyAuth';
import type * as login from './login';
import type * as register from './register';
import type * as getMe from './getMe';
import type * as getListForAdmin from './getListForAdmin';
import type * as approveRegRequest from './approveRegRequest';


export type Service = {
  createDefaultOnApiStartup(): Promise< createDefaultOnApiStartup.Resp >;
  verifyAuth( arg: verifyAuth.Arg ): Promise< verifyAuth.Resp >;
  login( arg: login.Arg ): Promise< login.Resp >;
  register( arg: register.Arg ): Promise< register.Resp >;
  getMe( arg: getMe.Arg ): Promise< getMe.Resp >;
  getListForAdmin( arg: getListForAdmin.Arg ): Promise< getListForAdmin.Resp >;
  approveRegRequest( arg: approveRegRequest.Arg ): Promise< approveRegRequest.Resp >;
};

export interface WithService {
  user: Service;
}


export * as createDefaultOnApiStartup from './createDefaultOnApiStartup';
export * as verifyAuth from './verifyAuth';
export * as login from './login';
export * as register from './register';
export * as getMe from './getMe';
export * as getListForAdmin from './getListForAdmin';
export * as approveRegRequest from './approveRegRequest';
