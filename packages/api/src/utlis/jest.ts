// eslint-disable-next-line import/no-extraneous-dependencies
import { initJestTags } from '@illia-web-dev/jest-tags';
import type { Express } from 'express';
import { getLocals } from './ILocals';


export const jestCleanUp = async ( app: Express ) => {
  const { dbClient, MongoDB } = getLocals( app );

  await MongoDB.dropDatabase();
  await dbClient.close();
};


export const { describeWithTags, testWithTags } = initJestTags( process.env );

export const testTags = {
  db: 'db',
  adapter: 'adapter',
  UserService: 'UserService',
  RegRqstService: 'RegRqstService',
  verifyJwt: 'verifyJwt',
} as const;
