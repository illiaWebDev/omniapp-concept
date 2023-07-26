// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import { getUserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import * as UserCore from '@omniapp-concept/common/dist/services/User/core';
import type { BcryptPassword } from '@illia-web-dev/types/dist/types/BcryptPassword';
import type * as ISO8601 from '@illia-web-dev/types/dist/types/ISO8601';
import type { Collection } from 'mongodb';
import type { WithObjIdT } from '@omniapp-concept/common/dist/services/_common/WithObjId';
import { UserServiceAdapter } from '../main';
import * as envVarsNS from '../../../../utlis/envVariables';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../../utlis/logger';
import { setupDb } from '../../../../app_servicesSetup_db';
import { getLocals } from '../../../../utlis/ILocals';
import { describeWithTags, jestCleanUp, testTags } from '../../../../utlis/jest';


// ===================================================================================

const tags = [ testTags.UserService, testTags.adapter, 'getList' ];
describeWithTags( tags, tags.join( ' > ' ), () => {
  const app = express();

  beforeAll( async () => {
    envVarsNS.overrideMongoUriForJest( 'J0mUr7h2' );
    switchLoggerToErrorLevel();

    await setupDb( app );
  } );
  afterAll( async () => {
    await jestCleanUp( app );

    resetLogLevel();
    envVarsNS.resetMongoUriForJest();
  } );


  test( 'returns empty array if collection is empty', async () => {
    const { MongoDB } = getLocals( app );
    const adapter = new UserServiceAdapter( MongoDB );

    const rez = await adapter.getList();

    expect( rez ).toStrictEqual( [] );
  } );


  test( 'returns array of all users in db, with omitted "password" and "_id" fields', async () => {
    const { MongoDB } = getLocals( app );
    const adapter = new UserServiceAdapter( MongoDB );
    const col: Collection< UserCore.UserInDb > = MongoDB.collection( UserCore.CollectionName );

    const getUserForCreation: () => UserCore.UserInDb = () => ( {
      id: getUserId(),
      username: String( Math.random() ),
      password: 'bcrypted' as BcryptPassword,
      role: ( () => {
        if ( Math.random() > 0.3 ) return [ 'admin' ];
        if ( Math.random() < 0.7 ) return [ 'powerUser' ];
        return [ 'user' ];
      } )(),
      status: Math.random() > 0.5 ? 'registered' : 'registrationRequest',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
      updatedAt: '2023-06-01T07:01:29.476Z' as ISO8601.UTC.Full,
    } );
    const usersForInsertion = [ getUserForCreation(), getUserForCreation(), getUserForCreation() ];

    await col.insertMany( usersForInsertion );
    const rez = await adapter.getList();

    expect( rez.length ).toBe( usersForInsertion.length );

    rez.forEach( inDb => {
      expect( Object.keys( inDb ).length ).toBe( 8 );
      expect( ( inDb as UserCore.UserInDb ).password ).toBeUndefined();
      expect( ( inDb as UserCore.UserInDb & WithObjIdT )._id ).toBeUndefined();
    } );


    await col.deleteMany();
  } );
} );
