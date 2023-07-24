// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import { getUserId, UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import * as UserCore from '@omniapp-concept/common/dist/services/User/core';
import type { BcryptPassword } from '@illia-web-dev/types/dist/types/BcryptPassword';
import * as envVarsNS from '../../../utlis/envVariables';
import { addWithHistory } from '../../__common';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../utlis/logger';
import { setupMigrations } from '../../../app_servicesSetup_migrations';
import { getLocals } from '../../../utlis/ILocals';
import { describeWithTags, jestCleanUp, testTags } from '../../../utlis/jest';


const { UserRole } = UserCore;

beforeAll( () => {
  switchLoggerToErrorLevel();
} );
afterAll( () => {
  resetLogLevel();
} );


// ===================================================================================

const tags = [ testTags.UserService, testTags.migrations, testTags.adapter ];
describeWithTags( tags, tags.join( ' > ' ), () => {
  const app = express();


  beforeAll( async () => {
    envVarsNS.overrideMongoUriForJest( 'Rk5dat' );

    await setupMigrations( app );
  } );
  afterAll( async () => {
    await jestCleanUp( app );

    envVarsNS.resetMongoUriForJest();
  } );


  test( 'Cannot insert user with incorrect shape', async () => {
    const { MongoDB } = getLocals( app );

    const user: UserCore.UserInDb = addWithHistory( {
      id: getUserId(),
      role: [ UserRole.admin ],
      status: 'registered',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      password: 555 as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      username: 123 as any,
    }, null );

    const usersCol = MongoDB.collection< UserCore.UserInDb >( UserCore.CollectionName );

    try {
      await usersCol.insertOne( user );
    } catch ( e ) {
      expect( e ).toBeInstanceOf( Error );
      expect( ( e as Error ).message ).toBe( 'Document failed validation' );
    }
  } );

  test( 'Cannot create two users with equal usernames', async () => {
    const { MongoDB } = getLocals( app );

    const getUser = (): UserCore.UserInDb => addWithHistory( {
      id: getUserId(),
      role: [ UserRole.admin ],
      status: 'registered',
      password: 'hashedPassword' as BcryptPassword,
      username: 'username',
    }, null );

    const usersCol = MongoDB.collection< UserCore.UserInDb >( UserCore.CollectionName );

    const insertRes = await usersCol.insertOne( getUser() );
    expect( insertRes ).toBeTruthy();
    expect( insertRes.insertedId ).toBeTruthy();


    try {
      await usersCol.insertOne( getUser() );
    } catch ( e ) {
      expect( e ).toBeInstanceOf( Error );
      expect( ( e as Error ).message ).toMatch( 'E11000 duplicate key error collection' );
    }
  } );

  test( 'Cannot create two users with equal ids', async () => {
    const { MongoDB } = getLocals( app );
    const sameId = '1111' as UserId;

    const getUser = ( username: string ): UserCore.UserInDb => addWithHistory( {
      id: sameId,
      password: 'hashedPassword' as BcryptPassword,
      username,
      status: 'registered',
      role: [ UserRole.admin ],
    }, null );

    const usersCol = MongoDB.collection< UserCore.UserInDb >( UserCore.CollectionName );
    const insertRes = await usersCol.insertOne( getUser( 'u1' ) );
    expect( insertRes ).toBeTruthy();
    expect( insertRes.insertedId ).toBeTruthy();


    try {
      await usersCol.insertOne( getUser( 'u2' ) );

      throw new Error( 'should not reach here' );
    } catch ( e ) {
      expect( e ).toBeInstanceOf( Error );
      expect( ( e as Error ).message ).toMatch( 'E11000 duplicate key error collection' );
    }
  } );
} );
