// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, jest, beforeAll, afterAll } from '@jest/globals';
import type { UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import type { ExcludeTFailure, ExcludeTSuccess } from '@illia-web-dev/types/dist/types/CommonRes';
import type { BcryptPassword } from '@illia-web-dev/types/dist/types/BcryptPassword';
import * as verifyAuthNS from './main';
import { getJwt } from '../__getJwt';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../../utlis/logger';
import { describeWithTags } from '../../../../utlis/jest';
import { serviceTagsArr, dummyAdapter } from '../../__testUtils';


const tags = serviceTagsArr.concat( 'verifyAuth', 'dummyAdapter' );
describeWithTags( tags, tags.join( ' > ' ), () => {
  beforeAll( () => {
    switchLoggerToErrorLevel();
  } );
  afterAll( () => {
    resetLogLevel();
  } );


  test( 'responds with "invalidAuth" if jwt is absent', async () => {
    const result = await verifyAuthNS._( {
      adapter: dummyAdapter,
      arg: {},
      jwtSecret: '',
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( 'invalidAuth' );
  } );

  test( 'responds with "invalidAuth" if jwt is present but malformed', async () => {
    const result = await verifyAuthNS._( {
      adapter: dummyAdapter,
      arg: { jwt: 'jwt' },
      jwtSecret: '',
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( 'invalidAuth' );
  } );

  test( 'responds with "invalidAuth" if jwt is well-formed, but secret is not valid', async () => {
    const jwt = getJwt( {
      id: '' as UserId,
      jwtExpiresIn: '10d',
      jwtSecret: 'wrong',
    } );
    const result = await verifyAuthNS._( {
      adapter: dummyAdapter,
      arg: { jwt },
      jwtSecret: 'secret',
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( 'invalidAuth' );
  } );

  test( 'responds with "expiredAuth" if jwt is expired', async () => {
    const jwtSecret = 'secret';

    const jwt = getJwt( {
      id: '' as UserId,
      jwtExpiresIn: '-5d',
      jwtSecret,
    } );
    const result = await verifyAuthNS._( {
      adapter: dummyAdapter,
      arg: { jwt },
      jwtSecret,
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( 'expiredAuth' );
  } );

  test( 'responds with "invalidAuth" if adapter.getAuthParts returned null', async () => {
    const userId = 'userId' as UserId;
    const jwtSecret = 'secret';

    const jwt = getJwt( {
      id: userId,
      jwtExpiresIn: '10d',
      jwtSecret,
    } );

    const getAuthParts: adapterNS.Adapter[ 'getAuthParts' ] = () => Promise.resolve( null );
    const mockedGetAuthParts = jest.fn( getAuthParts );

    const result = await verifyAuthNS._( {
      adapter: { ...dummyAdapter, getAuthParts: mockedGetAuthParts },
      arg: { jwt },
      jwtSecret,
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( 'invalidAuth' );

    const { lastCall } = mockedGetAuthParts.mock;
    expect( lastCall ).toBeTruthy();

    const [ lastArg ] = lastCall as NonNullable< typeof lastCall >;

    expect( Object.keys( lastArg ).length ).toBe( 1 );
    expect( lastArg.id ).toBe( userId );
    expect( lastArg.username ).toBeUndefined();
  } );

  test( 'succeeds (with absent required roles)', async () => {
    const userId = 'userId' as UserId;
    const jwtSecret = 'secret';

    const jwt = getJwt( {
      id: userId,
      jwtExpiresIn: '10d',
      jwtSecret,
    } );

    const authParts: adapterNS.getAuthParts.SuccessResp = {
      id: userId,
      password: '' as BcryptPassword,
      role: [],
    };
    const getAuthParts: adapterNS.Adapter[ 'getAuthParts' ] = () => Promise.resolve( authParts );

    const result = await verifyAuthNS._( {
      adapter: { ...dummyAdapter, getAuthParts },
      arg: { jwt },
      jwtSecret,
    } );

    expect( result.success ).toBe( true );

    const typedResult = result as ExcludeTFailure< typeof result >;
    expect( typedResult.data.authData.id ).toBe( authParts.id );
    expect( typedResult.data.authData.role ).toBe( authParts.role );

    expect( Object.keys( typedResult.data.jwtPayload ).length ).toBe( 3 );
    expect( typedResult.data.jwtPayload.sub ).toBe( userId );
  } );

  // ===================================================================================

  test( 'fails if roles do not match', async () => {
    const userId = 'userId' as UserId;
    const jwtSecret = 'secret';

    const jwt = getJwt( {
      id: userId,
      jwtExpiresIn: '10d',
      jwtSecret,
    } );

    const authParts: adapterNS.getAuthParts.SuccessResp = {
      id: userId,
      password: '' as BcryptPassword,
      role: [ 'user' ],
    };
    const getAuthParts: adapterNS.Adapter[ 'getAuthParts' ] = () => Promise.resolve( authParts );

    const result = await verifyAuthNS._( {
      adapter: { ...dummyAdapter, getAuthParts },
      arg: { jwt, allowedRoles: [ 'admin' ] },
      jwtSecret,
    } );

    expect( result.success ).toBe( false );

    const typedResult = result as ExcludeTSuccess< typeof result >;
    expect( typedResult.error ).toBe( 'notAllowed' );
  } );

  test( 'succeeds if roles match', async () => {
    const userId = 'userId' as UserId;
    const jwtSecret = 'secret';

    const jwt = getJwt( {
      id: userId,
      jwtExpiresIn: '10d',
      jwtSecret,
    } );

    const authParts: adapterNS.getAuthParts.SuccessResp = {
      id: userId,
      password: '' as BcryptPassword,
      role: [ 'admin' ],
    };
    const getAuthParts: adapterNS.Adapter[ 'getAuthParts' ] = () => Promise.resolve( authParts );

    const result = await verifyAuthNS._( {
      adapter: { ...dummyAdapter, getAuthParts },
      arg: { jwt, allowedRoles: [ 'admin' ] },
      jwtSecret,
    } );

    expect( result.success ).toBe( true );
  } );
} );
