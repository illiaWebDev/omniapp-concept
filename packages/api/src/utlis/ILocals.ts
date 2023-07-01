import type { Application } from 'express';
import type { Db, MongoClient } from 'mongodb';
import type * as servicesNS from '@omniapp-concept/common/dist/services';


export type ILocals = {
  MongoDB: Db;
  dbClient: MongoClient;
  services: servicesNS.WithServices;
};


export const getLocals = ( app: Application ): ILocals => app.locals as ILocals;

export const setInLocals = < K extends keyof ILocals >(
  app: Application,
  key: K,
  value: ILocals[ K ],
): typeof app => {
  getLocals( app )[ key ] = value;

  return app;
};
