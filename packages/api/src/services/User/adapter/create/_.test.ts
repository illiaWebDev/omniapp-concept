// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import type { Collection } from 'mongodb';
import { getUserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import * as UserCore from '@omniapp-concept/common/dist/services/User/core';
import type { BcryptPassword } from '@illia-web-dev/types/dist/types/BcryptPassword';
import type * as ISO8601 from '@illia-web-dev/types/dist/types/ISO8601';
import { UserServiceAdapter } from '../main';
import * as envVarsNS from '../../../../utlis/envVariables';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../../utlis/logger';
import { setupDb } from '../../../../app_servicesSetup_db';
import { getLocals } from '../../../../utlis/ILocals';
import { describeWithTags, jestCleanUp } from '../../../../utlis/jest';
import { adapterTagsArr } from '../../__testUtils';


const { UserRole } = UserCore;

beforeAll( () => {
  switchLoggerToErrorLevel();
} );
afterAll( () => {
  resetLogLevel();
} );


// ===================================================================================

const tags = adapterTagsArr.concat( [ 'create' ] );
describeWithTags( tags, tags.join( ' > ' ), () => {
  const app = express();

  beforeAll( async () => {
    envVarsNS.overrideMongoUriForJest( 'x4L1I' );

    await setupDb( app );
  } );
  afterAll( async () => {
    await jestCleanUp( app );

    envVarsNS.resetMongoUriForJest();
  } );


  test( 'returns true for successful create, creates user in db', async () => {
    const { MongoDB } = getLocals( app );
    const adapter = new UserServiceAdapter( MongoDB );
    const col: Collection< UserCore.UserInDb > = MongoDB.collection( UserCore.CollectionName );

    const userForCreation: UserCore.UserInDb = {
      id: getUserId(),
      username: 'username_for_create_user_check',
      password: 'bcrypted' as BcryptPassword,
      role: [ UserRole.admin ],
      status: 'registered',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
      updatedAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
    };

    const rez = await adapter.create( userForCreation );

    expect( rez ).toBe( true );

    const [ first, ...rest ] = await col.find( { username: userForCreation.username } ).toArray();
    expect( first ).toBeTruthy();
    expect( rest.length ).toBe( 0 );

    const userInDb = first as Exclude< typeof first, undefined >;

    expect( userInDb.username ).toBe( userForCreation.username );
    expect( userInDb.password ).toBe( userForCreation.password );
    expect( userInDb.role ).toStrictEqual( userForCreation.role );
    expect( userInDb.createdBy ).toBe( userForCreation.createdBy );
    expect( userInDb.createdAt ).toBe( userForCreation.createdAt );

    await col.deleteMany();
  } );


  test( 'returns false for call with duplicate username, does not create user in db', async () => {
    const { MongoDB } = getLocals( app );
    const adapter = new UserServiceAdapter( MongoDB );
    const col: Collection< UserCore.UserInDb > = MongoDB.collection( UserCore.CollectionName );

    const duplicateUsername = String( Math.random() );
    const userForCreation: UserCore.UserInDb = {
      id: getUserId(),
      username: duplicateUsername,
      password: 'bcrypted' as BcryptPassword,
      role: [ UserRole.admin ],
      status: 'registered',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
      updatedAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
    };

    const rez = await adapter.create( userForCreation );

    expect( rez ).toBe( true );
    expect( await col.countDocuments() ).toBe( 1 );


    const withDuplicateUserName: UserCore.UserInDb = {
      id: getUserId(),
      username: duplicateUsername,
      password: 'bcryptedNew' as BcryptPassword,
      role: [ UserRole.admin ],
      status: 'registered',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: '2023-06-02T07:01:29.476Z' as ISO8601.UTC.Full,
      updatedAt: '2023-06-02T07:01:29.476Z' as ISO8601.UTC.Full,
    };

    const duplicateCreateRes = await adapter.create( withDuplicateUserName );
    expect( duplicateCreateRes ).toBe( false );
    expect( await col.countDocuments() ).toBe( 1 );


    await col.deleteMany();
  } );

  test( 'returns false for call with duplicate userId, does not create user in db', async () => {
    const { MongoDB } = getLocals( app );
    const adapter = new UserServiceAdapter( MongoDB );
    const col: Collection< UserCore.UserInDb > = MongoDB.collection( UserCore.CollectionName );

    const duplicateUserId = getUserId();
    const userForCreation: UserCore.UserInDb = {
      id: duplicateUserId,
      username: '1',
      password: 'bcrypted' as BcryptPassword,
      role: [ UserRole.admin ],
      status: 'registered',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
      updatedAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
    };

    const rez = await adapter.create( userForCreation );

    expect( rez ).toBe( true );
    expect( await col.countDocuments() ).toBe( 1 );


    const withDuplicateUserName: UserCore.UserInDb = {
      id: duplicateUserId,
      username: '2',
      password: 'bcryptedNew' as BcryptPassword,
      role: [ UserRole.admin ],
      status: 'registered',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: '2023-06-02T07:01:29.476Z' as ISO8601.UTC.Full,
      updatedAt: '2023-06-02T07:01:29.476Z' as ISO8601.UTC.Full,
    };

    const duplicateCreateRes = await adapter.create( withDuplicateUserName );
    expect( duplicateCreateRes ).toBe( false );
    expect( await col.countDocuments() ).toBe( 1 );


    await col.deleteMany();
  } );
} );
