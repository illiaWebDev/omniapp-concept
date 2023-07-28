// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, jest, beforeAll, afterAll } from '@jest/globals';
import { verify } from 'jsonwebtoken';
import type { UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import type { ExcludeTFailure, ExcludeTSuccess } from '@illia-web-dev/types/dist/types/CommonRes';
import { SYSTEM } from '@omniapp-concept/common/dist/services/_common/WithHistory';
import type { UserOutOfDb } from '@omniapp-concept/common/dist/services/User/core';
import type { BcryptPassword } from '@illia-web-dev/types/dist/types/BcryptPassword';
import { decodeJWT } from '@omniapp-concept/common/dist/services/User/authParts';
import * as loginNS from './main';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../../utlis/logger';
import { describeWithTags } from '../../../../utlis/jest';
import { serviceTagsArr, dummyAdapter, full } from '../../__testUtils';


const tags = serviceTagsArr.concat( 'login', 'dummyAdapter' );
describeWithTags( tags, tags.join( ' > ' ), () => {
  beforeAll( () => {
    switchLoggerToErrorLevel();
  } );
  afterAll( () => {
    resetLogLevel();
  } );


  test( 'responds with "invalidLoginOrPassword" if adapter.getAuthParts returned null', async () => {
    const username = 'username';

    const getAuthParts: adapterNS.Adapter[ 'getAuthParts' ] = () => Promise.resolve( null );
    const mockedGetAuthParts = jest.fn( getAuthParts );

    const result = await loginNS._( {
      adapter: { ...dummyAdapter, getAuthParts: mockedGetAuthParts },
      arg: { password: '', username },
      jwtExpiresIn: '',
      jwtSecret: 'secret',
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( 'invalidLoginOrPassword' );

    const { lastCall } = mockedGetAuthParts.mock;
    expect( lastCall ).toBeTruthy();

    const [ lastArg ] = lastCall as NonNullable< typeof lastCall >;

    expect( lastArg.username ).toBe( username );
    expect( lastArg.id ).toBeUndefined();
  } );

  test( 'responds with "invalidLoginOrPassword" if password is incorrect', async () => {
    const username = 'username';

    const authPartsToRtrn: adapterNS.getAuthParts.SuccessResp = {
      id: 'userId' as UserId,
      password: 'bcrypted' as BcryptPassword,
      role: [],
    };
    const getAuthParts: adapterNS.Adapter[ 'getAuthParts' ] = () => Promise.resolve( authPartsToRtrn );

    const result = await loginNS._( {
      adapter: { ...dummyAdapter, getAuthParts },
      arg: { password: 'wrong', username },
      jwtExpiresIn: '',
      jwtSecret: 'secret',
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( 'invalidLoginOrPassword' );
  } );

  test( 'responds with "invalidLoginOrPassword" if adapter.get responded with null', async () => {
    const username = 'username';

    const authPartsToRtrn: adapterNS.getAuthParts.SuccessResp = {
      id: 'userId' as UserId,
      // bcrypted from "test"
      password: '$2a$12$VPvtplZ4BKF7FP2/yyfgx.X07kuwlLy0k1sLVN7tqK0aXXgEIogCe' as BcryptPassword,
      role: [],
    };
    const getAuthParts: adapterNS.Adapter[ 'getAuthParts' ] = () => Promise.resolve( authPartsToRtrn );
    const get: adapterNS.Adapter[ 'get' ] = () => Promise.resolve( null );
    const mockedGet = jest.fn( get );

    const result = await loginNS._( {
      adapter: { ...dummyAdapter, getAuthParts, get: mockedGet },
      arg: { password: 'test', username },
      jwtExpiresIn: '',
      jwtSecret: 'secret',
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( 'invalidLoginOrPassword' );


    const { lastCall } = mockedGet.mock;
    expect( lastCall ).toBeTruthy();

    const [ lastArg ] = lastCall as NonNullable< typeof lastCall >;

    expect( lastArg.id ).toBe( authPartsToRtrn.id );
    expect( lastArg.status ).toBe( 'registered' );
    expect( lastArg.username ).toBeUndefined();
  } );

  test( 'succeeds', async () => {
    const username = 'username';
    const userId = 'userId' as UserId;
    const jwtSecret = 'secret';

    const authPartsToRtrn: adapterNS.getAuthParts.SuccessResp = {
      id: userId,
      // bcrypted from "test"
      password: '$2a$12$VPvtplZ4BKF7FP2/yyfgx.X07kuwlLy0k1sLVN7tqK0aXXgEIogCe' as BcryptPassword,
      role: [],
    };
    const getAuthParts: adapterNS.Adapter[ 'getAuthParts' ] = () => Promise.resolve( authPartsToRtrn );

    const userToGet: UserOutOfDb = {
      createdAt: full,
      createdBy: SYSTEM,
      id: userId,
      role: [],
      status: 'registered',
      updatedAt: full,
      updatedBy: SYSTEM,
      username,
    };
    const get: adapterNS.Adapter[ 'get' ] = () => Promise.resolve( userToGet );
    const mockedGet = jest.fn( get );

    const result = await loginNS._( {
      adapter: { ...dummyAdapter, getAuthParts, get: mockedGet },
      arg: { password: 'test', username },
      jwtExpiresIn: '10d',
      jwtSecret,
    } );

    expect( result.success ).toBe( true );

    const typedResult = result as ExcludeTFailure< typeof result >;
    const { user, jwt } = typedResult.data;
    expect( user ).toBe( userToGet );

    const verifyRes = verify( jwt, jwtSecret );
    expect( typeof verifyRes !== 'string' ).toBe( true );

    const payload = decodeJWT( jwt );
    expect( payload.sub ).toBe( userId );
  } );
} );
