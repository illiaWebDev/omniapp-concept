import express, { Express } from 'express';
import { MongoClient } from 'mongodb';
import path from 'path';
import { config, up } from 'migrate-mongo';
import { GetServices } from '@omniapp-concept/common/dist/services';
import { getEnvVars } from './utlis/envVariables';
import { getLocals, setInLocals } from './utlis';
import * as servicesNS from './services';
import { logger } from './utlis/logger';


export const init = async (): Promise< Express > => {
  const { MONGO_URI } = getEnvVars();
  const app = express();

  // ===================================================================================


  const client = await new MongoClient( MONGO_URI ).connect();
  const db = client.db();
  setInLocals( app, 'MongoDB', db );
  setInLocals( app, 'dbClient', client );

  {
    const myConfig: config.Config = {
      mongodb: {
        url: MONGO_URI,
        options: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      },
      migrationsDir: path.join( __dirname, '..', 'migrations' ),
      changelogCollectionName: 'migrations_changelog',
      migrationFileExtension: '.js',
      useFileHash: false,
      moduleSystem: 'commonjs',
    };


    config.set( myConfig );

    const migrated = await up( db, client );
    migrated.forEach( fileName => logger.log( { level: 'debug', msg: `Migrated: ${ fileName }` } ) );
  }


  // ===================================================================================

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
