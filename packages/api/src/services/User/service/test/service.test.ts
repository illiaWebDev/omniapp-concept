// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, test, expect, jest, beforeAll, afterAll, afterEach } from '@jest/globals';
import express from 'express';
import { compare, hash } from 'bcrypt';
import { verify } from 'jsonwebtoken';
import type { Collection } from 'mongodb';
import type { UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import { usernameForDefaultUser } from '@omniapp-concept/common/dist/services/User/core';
import * as WithHistory from '@omniapp-concept/common/dist/services/_common/WithHistory';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import type * as serviceNS from '@omniapp-concept/common/dist/services/User/service';
import * as UserCore from '@omniapp-concept/common/dist/services/User/core';
import type { BcryptPassword } from '@illia-web-dev/types/dist/types/BcryptPassword';
import * as ISO8601 from '@illia-web-dev/types/dist/types/ISO8601';
import { ISO_8601_FULL } from '@omniapp-concept/common/dist/helpers';
import type { Millisecond } from '@illia-web-dev/types/dist/types/Time/Millisecond';
import { EpochSecond, getEpochMilliseconds } from '@illia-web-dev/types/dist/types/Time/Time';
import type { GetServices } from '@omniapp-concept/common/dist/services';
import { decodeJWT } from '@omniapp-concept/common/dist/services/User/authParts';
import { UserService } from '../main';
import * as envVarsNS from '../../../../utlis/envVariables';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../../utlis/logger';
import * as servicesSetup from '../../../../app_servicesSetup';
import { getLocals } from '../../../../utlis/ILocals';
import { describeWithTags, jestCleanUp, testTags } from '../../../../utlis/jest';


const dummyUserServiceAdapter: adapterNS.Adapter = {
  create: () => Promise.resolve( true ),
  get: () => Promise.resolve( null ),
  getAuthParts: () => Promise.resolve( null ),
  getList: () => Promise.resolve( [] ),
  patch: () => Promise.resolve( true ),
};
const getServices = ( () => ( {} ) ) as GetServices;

beforeAll( () => {
  switchLoggerToErrorLevel();
} );
afterAll( () => {
  resetLogLevel();
} );


describeWithTags( [ testTags.UserService ], `${ testTags.UserService }, noDb`, () => {
  describe( 'createDefaultOnApiStartup', () => {
    afterEach( () => {
      envVarsNS.resetEnvVars( [ 'CREATE_DEFAULT_USER_WITH_THIS_PASSWORD' ] );
    } );

    // test( 'returns false if no password for default user is set in env', async () => {
    //   envVarsNS.overrideDefaultUserPassword();

    //   const userService = new UserService( {
    //     adp: dummyUserServiceAdapter,
    //     getServices,
    //   } );

    //   const resp = await userService.createDefaultOnApiStartup();
    //   expect( resp ).toBe( false );
    // } );

    test( 'returns false if adapter returned existing user', async () => {
      envVarsNS.overrideDefaultUserPassword( 'password' );

      const full = ISO8601.UTC.getFull();

      const get: adapterNS.Adapter[ 'get' ] = () => Promise.resolve( {
        id: '' as UserId,
        createdAt: full,
        updatedAt: full,
        role: [ UserCore.UserRole.admin ],
        status: 'registered',
        username: '',
        updatedBy: 'system',
        createdBy: 'system',
      } );
      const mockedGet = jest.fn( get );

      const userService = new UserService( {
        adp: {
          ...dummyUserServiceAdapter,
          get: mockedGet,
        },
        getServices,
      } );

      const resp = await userService.createDefaultOnApiStartup();


      expect( resp ).toEqual( false );
      expect( mockedGet ).toBeCalledTimes( 1 );

      const { lastCall } = mockedGet.mock;
      expect( lastCall ).toBeTruthy();


      const [ arg ] = lastCall as Exclude< typeof lastCall, undefined >;

      expect( arg.username ).toEqual( usernameForDefaultUser );
    } );

    test( 'calls Adapter.create with correct param', async () => {
      const password = 'password';
      envVarsNS.overrideDefaultUserPassword( password );

      const create: adapterNS.Adapter[ 'create' ] = () => Promise.resolve( true );
      const mockedCreate = jest.fn( create );

      const userService = new UserService( {
        adp: {
          ...dummyUserServiceAdapter,
          create: mockedCreate,
        },
        getServices,
      } );

      const resp = await userService.createDefaultOnApiStartup();


      expect( resp ).toEqual( true );
      expect( mockedCreate ).toBeCalledTimes( 1 );

      const { lastCall } = mockedCreate.mock;
      expect( lastCall ).toBeTruthy();


      const [ arg ] = lastCall as Exclude< typeof lastCall, undefined >;

      expect( arg.username ).toEqual( usernameForDefaultUser );
      expect( arg.role ).toEqual( [ UserCore.UserRole.admin, UserCore.UserRole.powerUser, UserCore.UserRole.user ] );

      expect( await compare( password, arg.password ) ).toBeTruthy();

      expect( arg.createdBy ).toEqual( WithHistory.SYSTEM );
      expect( arg.updatedBy ).toEqual( WithHistory.SYSTEM );
      expect( arg.createdAt ).toMatch( ISO_8601_FULL );
      expect( arg.updatedAt ).toMatch( ISO_8601_FULL );
    } );
  } );

  describe( 'login', () => {
    const jwtSecret = 'secretForGetJwt';

    const jwtExpiresIn = '10d';
    // 10 days in milliseconds, used to check expiration on jwt
    const jwtExpiresInMs = 864000000 as Millisecond;

    beforeAll( () => {
      envVarsNS.overrideJwtSecret( jwtSecret );
      envVarsNS.overrideJwtExpiresIn( jwtExpiresIn );
    } );

    afterAll( () => {
      envVarsNS.resetEnvVars( [ 'JWT_SECRET', 'JWT_EXPIRES_IN' ] );
    } );

    test( 'fails if adapter.getAuthParts returns null', async () => {
      const getAuthParts: adapterNS.Adapter[ 'getAuthParts' ] = () => Promise.resolve( null );
      const mockedGetAuthParts = jest.fn( getAuthParts );

      const userService = new UserService( {
        adp: {
          ...dummyUserServiceAdapter,
          getAuthParts: mockedGetAuthParts,
        },
        getServices,
      } );


      const mockArgToBeExpected = {
        username: 'someusername',
      };
      const arg: Parameters< typeof userService.login >[ 0 ] = { ...mockArgToBeExpected, password: 'somepassword' };
      const resp = await userService.login( arg );

      expect( resp.success ).toBe( false );

      expect( mockedGetAuthParts ).toBeCalledTimes( 1 );
      expect( mockedGetAuthParts ).toBeCalledWith( mockArgToBeExpected );

      const typedResp = resp as Extract< typeof resp, { success: false } >;
      expect( typedResp.error ).toBe( 'invalidLoginOrPassword' );
    } );

    test( 'fails if password is wrong', async () => {
      const userAuthParts: adapterNS.getAuthParts.SuccessResp = {
        id: '' as UserId,
        password: 'hashed' as BcryptPassword,
        role: [ UserCore.UserRole.admin ],
      };

      const getAuthParts: adapterNS.Adapter[ 'getAuthParts' ] = () => Promise.resolve( userAuthParts );

      const userService = new UserService( {
        adp: {
          ...dummyUserServiceAdapter,
          getAuthParts,
        },
        getServices,
      } );

      const arg: serviceNS.login.Arg = { username: '', password: 'incorrect' };
      const resp = await userService.login( arg );

      expect( resp.success ).toBe( false );

      const typedResp = resp as Extract< typeof resp, { success: false } >;
      expect( typedResp.error ).toBe( 'invalidLoginOrPassword' );
    } );

    test.skip( 'returns correct jwt', async () => {
      const password = 'somestrongpassword';
      const userForJwt: adapterNS.getAuthParts.SuccessResp = {
        id: 'user_id_for_returns_correct_jwt' as UserId,
        password: await hash( password, UserCore.SALT_ROUNDS ) as BcryptPassword,
        role: [ UserCore.UserRole.admin ],
      };

      const getAuthParts: adapterNS.Adapter[ 'getAuthParts' ] = () => Promise.resolve( userForJwt );

      const userService = new UserService( {
        adp: {
          ...dummyUserServiceAdapter,
          getAuthParts,
        },
        getServices,
      } );

      const arg: serviceNS.login.Arg = { username: '', password };


      const now = getEpochMilliseconds();
      const expectedIatLowerBoundary = Math.floor( now / 1_000 ) as EpochSecond;
      const expectedIatUpperBoundary = ( expectedIatLowerBoundary + 1 ) as EpochSecond;

      // amount of EpochSeconds that our generated
      // exp should be gte
      const expectedExpirationLowerBoundary = Math.floor( ( now + jwtExpiresInMs ) / 1_000 ) as EpochSecond;
      // amount of EpochSeconds that our generated
      // exp should be lte. We add 1 second just
      // to be sure that jwt creation has enough
      // time to complete
      const expectedExpirationUpperBoundary = ( expectedExpirationLowerBoundary + 1 ) as EpochSecond;


      const resp = await userService.login( arg );

      expect( resp.success ).toBe( true );

      const typedResp = resp as Extract< typeof resp, { success: true } >;
      expect( typeof verify( typedResp.data.jwt, jwtSecret ) !== 'string' ).toBe( true );

      const jwtPayload = decodeJWT( typedResp.data.jwt );

      expect( Object.keys( jwtPayload ).length ).toBe( 3 );
      expect( jwtPayload.sub ).toBe( userForJwt.id );

      expect( jwtPayload.iat ).toBeGreaterThanOrEqual( expectedIatLowerBoundary );
      expect( jwtPayload.iat ).toBeLessThanOrEqual( expectedIatUpperBoundary );

      expect( jwtPayload.exp ).toBeGreaterThanOrEqual( expectedExpirationLowerBoundary );
      expect( jwtPayload.exp ).toBeLessThanOrEqual( expectedExpirationUpperBoundary );
    } );
  } );

  // describe( 'validateJwt', () => {
  //   const jwtSecret = 'secretForValidateJwtTests';
  //   const jwtExpiresIn = '10d';
  //   let userService = new UserService( {
  //     adp: dummyUserServiceAdapter,
  //     getServices,
  //   } );

  //   beforeAll( () => {
  //     envVarsNS.overrideJwtSecret( jwtSecret );
  //     envVarsNS.overrideJwtExpiresIn( jwtExpiresIn );

  //     userService = new UserService( {
  //       adp: dummyUserServiceAdapter,
  //       getServices,
  //     } );
  //   } );

  //   afterAll( () => {
  //     envVarsNS.resetEnvVars( [ 'JWT_SECRET', 'JWT_EXPIRES_IN' ] );
  //   } );


  //   test( 'responds with "invalidJwt" for invalid jwt (malformed)', () => {
  //     const resp = userService.reauth( { jwt: 'malformed' } );

  //     expect( resp.success ).toBe( false );

  //     const typedResp = resp as Extract< typeof resp, { success: false } >;
  //     expect( typedResp.error ).toEqual( 'invalidAuth' );
  //   } );

  //   test( 'responds with "invalidJwt" for invalid jwt (invalid secret)', () => {
  //     const jwt = sign( {}, 'invalidSecret', { subject: '', expiresIn: '100d' } );
  //     const resp = userService.reauth( { jwt } );

  //     expect( resp.success ).toBe( false );

  //     const typedResp = resp as Extract< typeof resp, { success: false } >;
  //     expect( typedResp.error ).toEqual( 'invalidAuth' );
  //   } );

  //   test( 'responds with "jwtExpired" for expired jwt', () => {
  //     const jwt = sign( {}, jwtSecret, { expiresIn: '-10s' } );
  //     const resp = userService.reauth( { jwt } );

  //     expect( resp.success ).toBe( false );

  //     const typedResp = resp as Extract< typeof resp, { success: false } >;
  //     expect( typedResp.error ).toEqual( 'expiredAuth' );
  //   } );

  //   test( 'responds with success for correct jwt', () => {
  //     const jwt = sign( {}, jwtSecret, { subject: '', expiresIn: jwtExpiresIn } );
  //     const resp = userService.reauth( { jwt } );

  //     expect( resp.success ).toBe( true );
  //   } );
  // } );

  // describe( 'getRegistrationRequests', () => {
  //   test( 'responds with "invalidAuth" if jwt is absent', async () => {
  //     const userService = new UserService( {
  //       adp: dummyUserServiceAdapter,
  //       getServices,
  //     } );

  //     const resp = await userService.getRegistrationRequests( {} );

  //     expect( resp.success ).toBe( false );

  //     const typedResp = resp as ExcludeTSuccess< typeof resp >;
  //     expect( typedResp.error ).toBe( 'invalidAuth' );
  //   } );

  //   test( 'responds with "invalidAuth" if jwt is present but malformed', async () => {
  //     const userService = new UserService( {
  //       adp: dummyUserServiceAdapter,
  //       getServices,
  //     } );

  //     const resp = await userService.getRegistrationRequests( { jwt: 'malformed' } );

  //     expect( resp.success ).toBe( false );

  //     const typedResp = resp as ExcludeTSuccess< typeof resp >;
  //     expect( typedResp.error ).toBe( 'invalidAuth' );
  //   } );

  //   test( 'responds with "invalidAuth" if jwt is present, well-formed but incorrectly signed', async () => {
  //     envVarsNS.overrideJwtSecret( 'secret' );

  //     const userService = new UserService( {
  //       adp: dummyUserServiceAdapter,
  //       getServices,
  //     } );

  //     const resp = await userService.getRegistrationRequests( {
  //       jwt: sign( {}, 'incorrectSecret' ),
  //     } );

  //     expect( resp.success ).toBe( false );

  //     const typedResp = resp as ExcludeTSuccess< typeof resp >;
  //     expect( typedResp.error ).toBe( 'invalidAuth' );

  //     envVarsNS.resetEnvVars( [ 'JWT_SECRET' ] );
  //   } );

  //   test( 'responds with "expiredAuth" if jwt is expired', async () => {
  //     const secret = 'secret';
  //     envVarsNS.overrideJwtSecret( secret );

  //     const userService = new UserService( {
  //       adp: dummyUserServiceAdapter,
  //       getServices,
  //     } );

  //     const resp = await userService.getRegistrationRequests( {
  //       jwt: sign( {}, secret, { expiresIn: '-10d' } ),
  //     } );

  //     expect( resp.success ).toBe( false );

  //     const typedResp = resp as ExcludeTSuccess< typeof resp >;
  //     expect( typedResp.error ).toBe( 'expiredAuth' );

  //     envVarsNS.resetEnvVars( [ 'JWT_SECRET' ] );
  //   } );

  //   test( 'responds with "notAllowed" if called by non-admin', async () => {
  //     const secret = 'secret';
  //     envVarsNS.overrideJwtSecret( secret );

  //     const userService = new UserService( {
  //       adp: dummyUserServiceAdapter,
  //       getServices,
  //     } );

  //     const authData: UserCore.AuthData = {
  //       exp: ( getEpochSecond() + 10_000 ) as EpochSecond,
  //       iat: getEpochSecond(),
  //       role: [ UserRole.user ],
  //       sub: '' as UserId,
  //       username: '',
  //     };
  //     const resp = await userService.getRegistrationRequests( {
  //       jwt: sign( authData, secret ),
  //     } );

  //     expect( resp.success ).toBe( false );

  //     const typedResp = resp as ExcludeTSuccess< typeof resp >;
  //     expect( typedResp.error ).toBe( 'notAllowed' );

  //     envVarsNS.resetEnvVars( [ 'JWT_SECRET' ] );
  //   } );

  //   test( 'calls RegRequestService.getList', async () => {
  //     const secret = 'secret';
  //     envVarsNS.overrideJwtSecret( secret );

  //     const getListResp: RegRqstServiceNS.getList.Resp = { success: true, data: [] };
  //     const getList: RegRqstServiceNS.Service[ 'getList' ] = () => (
  //       Promise.resolve( getListResp )
  //     );
  //     const mockedGetList = jest.fn( getList );

  //     const regReqstService: RegRqstServiceNS.Service = {
  //       create: () => Promise.resolve( { success: true, data: 'registrationRequestCreated' } ),
  //       getList: mockedGetList,
  //       approve: () => Promise.resolve( null ),
  //     };

  //     const userService = new UserService( {
  //       adp: dummyUserServiceAdapter,
  //       getServices: ( () => ( {
  //         registrationRequest: regReqstService,
  //       } ) ) as GetServices,
  //     } );

  //     const authData: UserCore.AuthData = {
  //       exp: ( getEpochSecond() + 10_000 ) as EpochSecond,
  //       iat: getEpochSecond(),
  //       role: [ UserRole.admin ],
  //       sub: '' as UserId,
  //       username: '',
  //     };
  //     const resp = await userService.getRegistrationRequests( {
  //       jwt: sign( authData, secret ),
  //     } );

  //     expect( resp.success ).toBe( true );

  //     const typedResp = resp as ExcludeTFailure< typeof resp >;
  //     expect( typedResp.data ).toBe( getListResp.data );

  //     expect( mockedGetList ).toBeCalledTimes( 1 );

  //     envVarsNS.resetEnvVars( [ 'JWT_SECRET' ] );
  //   } );
  // } );
} );


// ===================================================================================

describeWithTags( [ testTags.UserService, testTags.db ], `${ testTags.UserService } ${ testTags.db }`, () => {
  describe( 'createDefaultOnApiStartup', () => {
    let app = express();
    const passwordForDefaultUser = 'password';

    beforeAll( async () => {
      envVarsNS.overrideMongoUriForJest( 'yOcdRizt' );
      envVarsNS.overrideDefaultUserPassword( passwordForDefaultUser );

      app = await servicesSetup.init();
    } );
    afterAll( async () => {
      await jestCleanUp( app );

      envVarsNS.resetEnvVars( [ 'MONGO_URI', 'CREATE_DEFAULT_USER_WITH_THIS_PASSWORD' ] );
    } );

    test( 'successfully created default user on api startup', async () => {
      const { MongoDB } = getLocals( app );
      const col = MongoDB.collection( UserCore.CollectionName ) as Collection< UserCore.UserInDb >;

      const arg: Pick< UserCore.UserInDb, 'username' > = { username: usernameForDefaultUser };
      const [ count, user ] = await Promise.all( [
        col.countDocuments( arg ),
        col.findOne( arg ),
      ] );

      expect( count ).toBe( 1 );
      expect( user ).not.toBe( null );

      const typedUser = user as Exclude< typeof user, null >;

      expect( typedUser.username ).toBe( usernameForDefaultUser );
      expect( typedUser.role ).toStrictEqual(
        [ UserCore.UserRole.admin, UserCore.UserRole.powerUser, UserCore.UserRole.user ],
      );
      expect( await compare( passwordForDefaultUser, typedUser.password ) ).toBeTruthy();

      expect( typedUser.createdBy ).toBe( WithHistory.SYSTEM );
      expect( typedUser.updatedBy ).toBe( WithHistory.SYSTEM );
    } );

    test( 'does not create second default user', async () => {
      const { services: { user: userService }, MongoDB } = getLocals( app );
      const col = MongoDB.collection( UserCore.CollectionName ) as Collection< UserCore.UserInDb >;
      const res = await userService.createDefaultOnApiStartup();

      expect( res ).toBe( false );

      const arg: Pick< UserCore.UserInDb, 'username' > = { username: usernameForDefaultUser };
      const count = await col.countDocuments( arg );

      expect( count ).toBe( 1 );
    } );
  } );

  describe( 'getJwt', () => {
    let app = express();
    const defaultPassword = 'password';
    const jwtSecret = 'jwtSecret';

    beforeAll( async () => {
      envVarsNS.overrideMongoUriForJest( 'owJVQSW8' );
      envVarsNS.overrideDefaultUserPassword( defaultPassword );
      envVarsNS.overrideJwtSecret( jwtSecret );
      envVarsNS.overrideJwtExpiresIn( '10d' );

      app = await servicesSetup.init();
    } );
    afterAll( async () => {
      await jestCleanUp( app );

      envVarsNS.resetEnvVars(
        [ 'MONGO_URI', 'CREATE_DEFAULT_USER_WITH_THIS_PASSWORD', 'JWT_SECRET', 'JWT_EXPIRES_IN' ],
      );
    } );

    test( 'fails for non-existent user', async () => {
      const { services: { user: userService } } = getLocals( app );
      const res = await userService.login( { username: '', password: '' } );

      expect( res.success ).toBe( false );

      const typedRes = res as Extract< typeof res, { success: false } >;
      expect( typedRes.error ).toBe( 'invalidLoginOrPassword' );
    } );

    test( 'fails if password is incorrect', async () => {
      const { services: { user: userService } } = getLocals( app );
      const res = await userService.login( { username: usernameForDefaultUser, password: '' } );

      expect( res.success ).toBe( false );

      const typedRes = res as Extract< typeof res, { success: false } >;
      expect( typedRes.error ).toBe( 'invalidLoginOrPassword' );
    } );

    test( 'returns correct jwt', async () => {
      const { services: { user: userService } } = getLocals( app );
      const res = await userService.login( {
        username: usernameForDefaultUser,
        password: defaultPassword,
      } );

      expect( res.success ).toBe( true );

      const typedRes = res as Extract< typeof res, { success: true } >;
      expect( typeof verify( typedRes.data.jwt, jwtSecret ) !== 'string' ).toBe( true );
    } );
  } );
} );


// describeWithTags( [ testTags.verifyJwt ], 'verifyJwt', () => {
//   test( 'fails on malformed or signature-less jwt tokens', async () => {
//     const signatureLess = 'eyJhbGciOiJub25lIn0.eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ.';
//     const malformed = 'malformed';
//     const malformed2 = 'abc.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

//     const getAuthData: GetAuthData = () => Promise.resolve( null );

//     const results = await Promise.all(
//       [
//         signatureLess,
//         malformed,
//         malformed2,
//       ].map( jwt => verifyJwt( { jwt, secret: 'secret', getAuthData } ) ),
//     );

//     results.forEach( result => {
//       expect( result.success ).toBe( false );

//       const typedResult = result as ExcludeTSuccess< typeof result >;
//       expect( typedResult.error ).toBe( 'invalidAuth' );
//     } );
//   } );
// } );
