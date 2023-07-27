// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, jest, beforeAll, afterAll } from '@jest/globals';
import type { UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import type { EpochSecond } from '@illia-web-dev/types/dist/types/Time/Time';
import type { ExcludeTFailure, ExcludeTSuccess } from '@illia-web-dev/types/dist/types/CommonRes';
import { SYSTEM } from '@omniapp-concept/common/dist/services/_common/WithHistory';
import { UserOutOfDb } from '@omniapp-concept/common/dist/services/User/core';
import * as getMeNS from './main';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../../utlis/logger';
import { describeWithTags } from '../../../../utlis/jest';
import { serviceTagsArr, dummyAdapter, full } from '../../__testUtils';


const tags = serviceTagsArr.concat( 'getMe', 'dummyAdapter' );
describeWithTags( tags, tags.join( ' > ' ), () => {
  beforeAll( () => {
    switchLoggerToErrorLevel();
  } );
  afterAll( () => {
    resetLogLevel();
  } );


  test( 'fails with "notAllowed" if verifyAuth returned "notAllowed', async () => {
    const notAllowed = 'notAllowed';

    const result = await getMeNS._( {
      adapter: dummyAdapter,
      arg: {},
      verifyAuth: () => Promise.resolve( { success: false, error: notAllowed } ),
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( notAllowed );
  } );

  test( 'fails with "expiredAuth" if verifyAuth returned "expiredAuth', async () => {
    const expiredAuth = 'expiredAuth';

    const result = await getMeNS._( {
      adapter: dummyAdapter,
      arg: {},
      verifyAuth: () => Promise.resolve( { success: false, error: expiredAuth } ),
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( expiredAuth );
  } );

  test( 'fails with "invalidAuth" if verifyAuth returned "invalidAuth', async () => {
    const invalidAuth = 'invalidAuth';

    const result = await getMeNS._( {
      adapter: dummyAdapter,
      arg: {},
      verifyAuth: () => Promise.resolve( { success: false, error: invalidAuth } ),
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( invalidAuth );
  } );

  test( 'succeeds, calls adater.get with correct args, returns correct user', async () => {
    const authorId = 'autorId' as UserId;

    const userToGet: UserOutOfDb = {
      createdAt: full,
      createdBy: SYSTEM,
      id: authorId,
      role: [],
      status: 'registered',
      updatedAt: full,
      updatedBy: SYSTEM,
      username: '',
    };
    const get: adapterNS.Adapter[ 'get' ] = () => Promise.resolve( userToGet );
    const mockedGet = jest.fn( get );

    const result = await getMeNS._( {
      adapter: { ...dummyAdapter, get: mockedGet },
      arg: {},
      verifyAuth: () => Promise.resolve( {
        success: true,
        data: {
          authData: { id: authorId, role: [] },
          jwtPayload: {
            exp: 0 as EpochSecond,
            iat: 0 as EpochSecond,
            sub: authorId,
          },
        },
      } ),
    } );

    expect( result.success ).toBe( true );
    const typedResult = result as ExcludeTFailure< typeof result >;

    expect( typedResult.data ).toBe( userToGet );

    const { lastCall } = mockedGet.mock;
    expect( lastCall ).toBeTruthy();

    const [ lastArg ] = lastCall as NonNullable< typeof lastCall >;

    expect( lastArg.id ).toBe( authorId );
    expect( lastArg.status ).toBe( 'registered' );
    expect( lastArg.username ).toBeUndefined();
  } );
} );
