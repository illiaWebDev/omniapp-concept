// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import { Collection } from 'mongodb';
import { getUserId, UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import * as UserCore from '@omniapp-concept/common/dist/services/User/core';
import type { BcryptPassword } from '@illia-web-dev/types/dist/types/BcryptPassword';
import * as ISO8601 from '@illia-web-dev/types/dist/types/ISO8601';
import type { WithObjIdT } from '@omniapp-concept/common/dist/services/_common/WithObjId';
import { UserServiceAdapter } from './adapter';
import * as envVarsNS from '../../utlis/envVariables';
import { addWithHistory } from '../__common';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../utlis/logger';
import * as servicesSetup from '../../app_servicesSetup';
import { getLocals } from '../../utlis/ILocals';
import { describeWithTags, jestCleanUp, testTags } from '../../utlis/jest';

const { UserRole } = UserCore;

beforeAll( () => {
  switchLoggerToErrorLevel();
} );
afterAll( () => {
  resetLogLevel();
} );


// ===================================================================================


describeWithTags( [ testTags.UserService, testTags.adapter, testTags.db ], 'UserService adapterAndDb, db', () => {
  describe( 'migrations', () => {
    let app = express();


    beforeAll( async () => {
      envVarsNS.overrideMongoUri( 'mongodb://localhost:27017/omniapp-concept-users-adapter-and-db-Rkudop0cjS' );

      app = await servicesSetup.init();
    } );
    afterAll( async () => {
      await jestCleanUp( app );

      envVarsNS.resetEnvVars( [ 'MONGO_URI' ] );
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

  describe( 'adapter', () => {
    let app = express();

    beforeAll( async () => {
      envVarsNS.overrideMongoUri( 'mongodb://localhost:27017/omniapp-concept-users-adapter-x4L1IJsudH' );

      app = await servicesSetup.init();
    } );
    afterAll( async () => {
      await jestCleanUp( app );

      envVarsNS.resetEnvVars( [ 'MONGO_URI' ] );
    } );


    test( '"create" succeeds', async () => {
      const { MongoDB } = getLocals( app );
      const adapter = new UserServiceAdapter( MongoDB );
      const col = MongoDB.collection( UserCore.CollectionName ) as Collection< UserCore.UserInDb >;

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

      const [ first ] = await col.find( { username: userForCreation.username } ).toArray();
      expect( first ).toBeTruthy();

      const userInDb = first as Exclude< typeof first, undefined >;

      expect( userInDb.username ).toBe( userForCreation.username );
      expect( userInDb.password ).toBe( userForCreation.password );
      expect( userInDb.role ).toStrictEqual( userForCreation.role );
      expect( userInDb.createdBy ).toBe( userForCreation.createdBy );
      expect( userInDb.createdAt ).toBe( userForCreation.createdAt );
    } );


    test( '"get" returns null if no user is found', async () => {
      const { MongoDB } = getLocals( app );
      const adapter = new UserServiceAdapter( MongoDB );

      const rez = await adapter.get( {
        username: 'does not exist for UserAdapter.get',
        status: 'registered',
      } );

      expect( rez ).toBe( null );
    } );
    test( '"get" succeeds, omits "password" and "_id" fields', async () => {
      const { MongoDB } = getLocals( app );
      const adapter = new UserServiceAdapter( MongoDB );

      const userForCreation: UserCore.UserInDb = {
        id: getUserId(),
        username: 'username_for_get_user_succeds',
        password: 'bcrypted' as BcryptPassword,
        role: [ UserRole.admin ],
        status: 'registered',
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
        updatedAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
      };

      await adapter.create( userForCreation );
      const rez = await adapter.get( {
        username: userForCreation.username,
        status: 'registered',
      } );

      expect( rez ).not.toBe( null );

      const userOutOfDb = rez as Exclude< typeof rez, null >;

      expect( userForCreation.username ).toBe( userOutOfDb.username );
      expect( ( userOutOfDb as UserCore.UserInDb ).password ).toBeUndefined();
      expect( ( userOutOfDb as UserCore.UserOutOfDb & WithObjIdT )._id ).toBeUndefined();
    } );


    test( '"getAuthParts" returns null if no user is found', async () => {
      const { MongoDB } = getLocals( app );
      const adapter = new UserServiceAdapter( MongoDB );

      const resp = await adapter.getAuthParts( {
        type: 'username',
        username: 'does not exist for getUserForJwt',
      } );
      expect( resp ).toBe( null );
    } );
    test( '"getAuthParts" succeeds', async () => {
      const { MongoDB } = getLocals( app );
      const adapter = new UserServiceAdapter( MongoDB );

      const userForCreation: UserCore.UserInDb = {
        id: getUserId(),
        username: 'username_for_getUserForJwt_success',
        password: 'bcrypted' as BcryptPassword,
        role: [ UserRole.admin ],
        status: 'registered',
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
        updatedAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
      };

      await adapter.create( userForCreation );
      const rez = await adapter.getAuthParts( {
        type: 'username',
        username: userForCreation.username,
      } );

      expect( rez ).not.toBe( null );

      const successResp = rez as Exclude< typeof rez, null >;

      expect( Object.keys( successResp ).length ).toBe( 3 );
      expect( successResp.id ).toBe( userForCreation.id );
      expect( successResp.password ).toBe( userForCreation.password );
      expect( successResp.role ).toStrictEqual( userForCreation.role );
    } );
  } );
} );
