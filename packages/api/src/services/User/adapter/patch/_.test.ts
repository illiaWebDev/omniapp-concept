// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import { getUserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import * as UserCore from '@omniapp-concept/common/dist/services/User/core';
import type { BcryptPassword } from '@illia-web-dev/types/dist/types/BcryptPassword';
import type * as ISO8601 from '@illia-web-dev/types/dist/types/ISO8601';
import type { Collection } from 'mongodb';
import type * as patchNS from '@omniapp-concept/common/dist/services/User/adapter/patch';
import { UserServiceAdapter } from '../main';
import * as envVarsNS from '../../../../utlis/envVariables';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../../utlis/logger';
import { setupDb } from '../../../../app_servicesSetup_db';
import { getLocals } from '../../../../utlis/ILocals';
import { describeWithTags, jestCleanUp, testTags } from '../../../../utlis/jest';


// ===================================================================================

const tags = [ testTags.UserService, testTags.adapter, 'patch' ];
describeWithTags( tags, tags.join( ' > ' ), () => {
  const app = express();

  beforeAll( async () => {
    envVarsNS.overrideMongoUriForJest( 'lAnJzO' );
    switchLoggerToErrorLevel();

    await setupDb( app );
  } );
  afterAll( async () => {
    await jestCleanUp( app );

    resetLogLevel();
    envVarsNS.resetMongoUriForJest();
  } );


  test( 'succeeds', async () => {
    const { MongoDB } = getLocals( app );
    const adapter = new UserServiceAdapter( MongoDB );
    const col: Collection< UserCore.UserInDb > = MongoDB.collection( UserCore.CollectionName );

    const forInsert: UserCore.UserInDb = {
      id: getUserId(),
      username: String( Math.random() ),
      password: 'bcrypted' as BcryptPassword,
      role: [ 'admin' ],
      status: 'registrationRequest',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
      updatedAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
    };

    await col.insertOne( forInsert );

    const authorId = getUserId();
    const patchArg: patchNS.Arg = {
      id: forInsert.id,
      data: {
        createdAt: '2023-06-10T07:01:29.476Z' as ISO8601.UTC.Full,
        updatedAt: '2023-06-10T07:01:29.476Z' as ISO8601.UTC.Full,
        status: 'registered',
        createdBy: authorId,
        updatedBy: authorId,
      },
    };
    const rez = await adapter.patch( patchArg );

    expect( rez ).toBe( true );

    const inDb = await col.findOne( { id: forInsert.id } );
    expect( inDb ).toBeTruthy();

    const userInDb = inDb as Exclude< typeof inDb, null >;

    expect( userInDb.createdBy ).toBe( patchArg.data.createdBy );
    expect( userInDb.updatedBy ).toBe( patchArg.data.updatedBy );
    expect( userInDb.status ).toBe( patchArg.data.status );
    expect( userInDb.updatedAt ).toBe( patchArg.data.updatedAt );
    expect( userInDb.createdAt ).toBe( patchArg.data.createdAt );


    await col.deleteMany();
  } );
} );
