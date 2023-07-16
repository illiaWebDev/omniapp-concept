// eslint-disable-next-line import/no-extraneous-dependencies
import { initJestTags } from '@illia-web-dev/jest-tags';
import type { Express } from 'express';
import { getLocals } from './ILocals';


export const jestCleanUp = async ( app: Express ) => {
  const { dbClient, MongoDB } = getLocals( app );

  if ( MongoDB.databaseName.indexOf( '-dHdjE4FMoP-' ) === -1 ) {
    throw new Error( 'QeKIhB_q3s | db name must have "-dHdjE4FMoP-" marking present' );
  }

  await MongoDB.dropDatabase();
  await dbClient.close();
};


export const { describeWithTags, testWithTags } = initJestTags( process.env );

export const testTags = {
  db: 'db',
  adapter: 'adapter',
  migrations: 'migrations',

  UserService: 'UserService',

  smoke: 'smoke',
} as const;
