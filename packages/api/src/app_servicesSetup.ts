import express, { Express } from 'express';
import { GetServices } from '@omniapp-concept/common/dist/services';
import { getLocals, setInLocals } from './utlis';
import * as servicesNS from './services';
import { setupDb } from './app_servicesSetup_db';


export const init = async (): Promise< Express > => {
  const app = express();

  await setupDb( app );

  // ===================================================================================

  const { MongoDB: db } = getLocals( app );

  const getServices: GetServices = () => getLocals( app ).services;

  const userService = new servicesNS.User.UserService( {
    adp: new servicesNS.User.UserServiceAdapter( db ),
    getServices,
  } );
  await userService.createDefaultOnApiStartup();


  setInLocals( app, 'services', {
    user: userService,
  } );


  return app;
};
