// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import { UserId, getUserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import * as UserCore from '@omniapp-concept/common/dist/services/User/core';
import type { BcryptPassword } from '@illia-web-dev/types/dist/types/BcryptPassword';
import type * as ISO8601 from '@illia-web-dev/types/dist/types/ISO8601';
import type { Collection } from 'mongodb';
import { UserServiceAdapter } from '../../main';
import * as envVarsNS from '../../../../../utlis/envVariables';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../../../utlis/logger';
import { setupMigrations } from '../../../../../app_servicesSetup_migrations';
import { getLocals } from '../../../../../utlis/ILocals';
import { describeWithTags, jestCleanUp, testTags } from '../../../../../utlis/jest';


const { UserRole } = UserCore;

beforeAll( () => {
  switchLoggerToErrorLevel();
} );
afterAll( () => {
  resetLogLevel();
} );


// ===================================================================================

const tags = [ testTags.UserService, testTags.adapter, 'getAuthParts' ];
describeWithTags( tags, tags.join( ' > ' ), () => {
  const app = express();

  beforeAll( async () => {
    envVarsNS.overrideMongoUriForJest( 'CNnBwa' );

    await setupMigrations( app );
  } );
  afterAll( async () => {
    await jestCleanUp( app );

    envVarsNS.resetEnvVars( [ 'MONGO_URI' ] );
  } );


  test( 'returns null if no user is found', async () => {
    const { MongoDB } = getLocals( app );
    const adapter = new UserServiceAdapter( MongoDB );

    const rez1 = await adapter.getAuthParts( { username: '' } );
    const rez2 = await adapter.getAuthParts( { id: '' as UserId } );

    expect( rez1 ).toBe( null );
    expect( rez2 ).toBe( null );
  } );


  test( 'gets authParts by username, has only id, password and role props', async () => {
    const { MongoDB } = getLocals( app );
    const adapter = new UserServiceAdapter( MongoDB );
    const col: Collection< UserCore.UserInDb > = MongoDB.collection( UserCore.CollectionName );

    const userForCreation: UserCore.UserInDb = {
      id: getUserId(),
      username: 'username',
      password: 'bcrypted' as BcryptPassword,
      role: [ UserRole.admin ],
      status: 'registered',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
      updatedAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
    };

    await adapter.create( userForCreation );
    const rez = await adapter.getAuthParts( { username: userForCreation.username } );

    expect( rez ).not.toBe( null );

    const authParts = rez as Exclude< typeof rez, null >;

    expect( Object.keys( authParts ).length ).toBe( 3 );

    expect( userForCreation.id ).toBe( authParts.id );
    expect( userForCreation.password ).toBe( authParts.password );
    expect( userForCreation.role ).toStrictEqual( authParts.role );


    await col.deleteMany();
  } );

  test( 'gets user by id, has only id, password and role props', async () => {
    const { MongoDB } = getLocals( app );
    const adapter = new UserServiceAdapter( MongoDB );
    const col: Collection< UserCore.UserInDb > = MongoDB.collection( UserCore.CollectionName );

    const userForCreation: UserCore.UserInDb = {
      id: getUserId(),
      username: 'username',
      password: 'bcrypted' as BcryptPassword,
      role: [ UserRole.admin ],
      status: 'registered',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
      updatedAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
    };

    await adapter.create( userForCreation );
    const rez = await adapter.getAuthParts( { id: userForCreation.id } );

    expect( rez ).not.toBe( null );

    const authParts = rez as Exclude< typeof rez, null >;

    expect( Object.keys( authParts ).length ).toBe( 3 );

    expect( userForCreation.id ).toBe( authParts.id );
    expect( userForCreation.password ).toBe( authParts.password );
    expect( userForCreation.role ).toStrictEqual( authParts.role );


    await col.deleteMany();
  } );
} );
