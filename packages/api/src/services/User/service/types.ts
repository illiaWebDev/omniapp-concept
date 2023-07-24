import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import type { GetServices } from '@omniapp-concept/common/dist/services';


export type UserServiceConstructorArg = {
  adp: adapterNS.Adapter;
  getServices: GetServices;
};
