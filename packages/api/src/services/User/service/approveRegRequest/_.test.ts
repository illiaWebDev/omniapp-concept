// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, jest, beforeAll, afterAll } from '@jest/globals';
import type { UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import type { EpochSecond } from '@illia-web-dev/types/dist/types/Time/Time';
import type { ExcludeTSuccess } from '@illia-web-dev/types/dist/types/CommonRes';
import * as approveRegRequestNS from './main';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../../utlis/logger';
import { describeWithTags } from '../../../../utlis/jest';
import { serviceTagsArr, dummyAdapter } from '../../__testUtils';


const tags = serviceTagsArr.concat( 'approveRegRequest', 'dummyAdapter' );
describeWithTags( tags, tags.join( ' > ' ), () => {
  beforeAll( () => {
    switchLoggerToErrorLevel();
  } );
  afterAll( () => {
    resetLogLevel();
  } );


  test( 'fails with "notAllowed" if verifyAuth returned "notAllowed', async () => {
    const notAllowed = 'notAllowed';

    const result = await approveRegRequestNS._( {
      adapter: dummyAdapter,
      arg: { id: '' as UserId },
      verifyAuth: () => Promise.resolve( { success: false, error: notAllowed } ),
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( notAllowed );
  } );

  test( 'fails with "expiredAuth" if verifyAuth returned "expiredAuth', async () => {
    const expiredAuth = 'expiredAuth';

    const result = await approveRegRequestNS._( {
      adapter: dummyAdapter,
      arg: { id: '' as UserId },
      verifyAuth: () => Promise.resolve( { success: false, error: expiredAuth } ),
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( expiredAuth );
  } );

  test( 'fails with "invalidAuth" if verifyAuth returned "invalidAuth', async () => {
    const invalidAuth = 'invalidAuth';

    const result = await approveRegRequestNS._( {
      adapter: dummyAdapter,
      arg: { id: '' as UserId },
      verifyAuth: () => Promise.resolve( { success: false, error: invalidAuth } ),
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( invalidAuth );
  } );

  test( 'succeeds, calls adater.patch with correct args', async () => {
    const idToApprove = 'toApprove' as UserId;
    const authorId = 'autorId' as UserId;

    const patch: adapterNS.Adapter[ 'patch' ] = () => Promise.resolve( true );
    const mockedPatch = jest.fn( patch );

    const result = await approveRegRequestNS._( {
      adapter: { ...dummyAdapter, patch: mockedPatch },
      arg: { id: idToApprove },
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

    const { lastCall } = mockedPatch.mock;
    expect( lastCall ).toBeTruthy();

    const [ lastArg ] = lastCall as NonNullable< typeof lastCall >;

    expect( lastArg.id ).toBe( idToApprove );
    expect( lastArg.data.status ).toBe( 'registered' );
    expect( lastArg.data.updatedBy ).toBe( authorId );
  } );
} );
