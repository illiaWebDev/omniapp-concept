// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import { getUserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import * as UserCore from '@omniapp-concept/common/dist/services/User/core';
import type { BcryptPassword } from '@illia-web-dev/types/dist/types/BcryptPassword';
import type * as ISO8601 from '@illia-web-dev/types/dist/types/ISO8601';
import type { WithObjIdT } from '@omniapp-concept/common/dist/services/_common/WithObjId';
import type { Collection } from 'mongodb';
import { UserServiceAdapter } from '../main';
import * as envVarsNS from '../../../../utlis/envVariables';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../../utlis/logger';
import { setupMigrations } from '../../../../app_servicesSetup_migrations';
import { getLocals } from '../../../../utlis/ILocals';
import { describeWithTags, jestCleanUp, testTags } from '../../../../utlis/jest';


const { UserRole } = UserCore;

beforeAll( () => {
  switchLoggerToErrorLevel();
} );
afterAll( () => {
  resetLogLevel();
} );


// ===================================================================================

const tags = [ testTags.UserService, testTags.adapter, 'get' ];
describeWithTags( tags, tags.join( ' > ' ), () => {
  const app = express();

  beforeAll( async () => {
    envVarsNS.overrideMongoUriForJest( 'vMIHHb' );

    await setupMigrations( app );
  } );
  afterAll( async () => {
    await jestCleanUp( app );

    envVarsNS.resetMongoUriForJest();
  } );


  test( 'returns null if no user is found', async () => {
    const { MongoDB } = getLocals( app );
    const adapter = new UserServiceAdapter( MongoDB );

    const rez = await adapter.get( {
      username: 'does not exist for UserAdapter.get',
      status: 'registered',
    } );

    expect( rez ).toBe( null );
  } );


  test( 'gets user by username, omits "password" and "_id" fields', async () => {
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
    const rez = await adapter.get( { username: userForCreation.username } );

    expect( rez ).not.toBe( null );

    const userOutOfDb = rez as Exclude< typeof rez, null >;

    expect( Object.keys( userOutOfDb ).length ).toBe( 8 );

    expect( userForCreation.username ).toBe( userOutOfDb.username );
    expect( ( userOutOfDb as UserCore.UserInDb ).password ).toBeUndefined();
    expect( ( userOutOfDb as UserCore.UserOutOfDb & WithObjIdT )._id ).toBeUndefined();


    await col.deleteMany();
  } );

  test( 'gets user by id, omits "password" and "_id" fields', async () => {
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
    const rez = await adapter.get( { id: userForCreation.id } );

    expect( rez ).not.toBe( null );

    const userOutOfDb = rez as Exclude< typeof rez, null >;

    expect( Object.keys( userOutOfDb ).length ).toBe( 8 );

    expect( userForCreation.id ).toBe( userOutOfDb.id );
    expect( ( userOutOfDb as UserCore.UserInDb ).password ).toBeUndefined();
    expect( ( userOutOfDb as UserCore.UserOutOfDb & WithObjIdT )._id ).toBeUndefined();


    await col.deleteMany();
  } );
} );
