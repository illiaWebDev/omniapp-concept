import type { Express } from 'express';
import { MongoClient } from 'mongodb';
import path from 'path';
import { config, up } from 'migrate-mongo';
import { getEnvVars } from './utlis/envVariables';
import { setInLocals } from './utlis';
import { logger } from './utlis/logger';


export const setupDb = async ( app: Express ): Promise< void > => {
  const { MONGO_URI } = getEnvVars();

  // ===================================================================================


  const client = await new MongoClient( MONGO_URI ).connect();
  const db = client.db();
  setInLocals( app, 'MongoDB', db );
  setInLocals( app, 'dbClient', client );

  {
    const migrateMongoConfig: config.Config = {
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


    config.set( migrateMongoConfig );

    const migrated = await up( db, client );
    migrated.forEach( fileName => logger.log( { level: 'debug', msg: `Migrated: ${ fileName }` } ) );
  }
};
