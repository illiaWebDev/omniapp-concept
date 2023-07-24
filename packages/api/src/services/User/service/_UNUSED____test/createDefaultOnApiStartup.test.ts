// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, test, expect, jest, beforeAll, afterAll, afterEach } from '@jest/globals';
import express from 'express';
import { compare } from 'bcrypt';
import type { Collection } from 'mongodb';
import type { UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import { usernameForDefaultUser } from '@omniapp-concept/common/dist/services/User/core';
import * as WithHistory from '@omniapp-concept/common/dist/services/_common/WithHistory';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import * as UserCore from '@omniapp-concept/common/dist/services/User/core';
import * as ISO8601 from '@illia-web-dev/types/dist/types/ISO8601';
import { ISO_8601_FULL } from '@omniapp-concept/common/dist/helpers';
import type { GetServices } from '@omniapp-concept/common/dist/services';
import { getFull } from '@illia-web-dev/types/dist/types/ISO8601/UTC';
import { UserService } from '../main';
import * as envVarsNS from '../../../../utlis/envVariables';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../../utlis/logger';
import * as servicesSetup from '../../../../app_servicesSetup';
import { getLocals } from '../../../../utlis/ILocals';
import { describeWithTags, jestCleanUp, testTags } from '../../../../utlis/jest';


const dummyAdapter: adapterNS.Adapter = {
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

const full = getFull();

const tags = [ testTags.UserService, 'createDefaultOnApiStartup' ];
describeWithTags( tags, tags.join( ' > ' ), () => {
  describe( 'dummyAdapter', () => {
    test( 'returns false if adapter responded with user in db', async () => {
      const service = new UserService( {
        adp: {
          ...dummyAdapter,
          get: () => Promise.resolve( {
            id: '' as UserId,
            createdAt: full,
            createdBy: 'system',
            role: [],
            status: 'registered',
            updatedAt: full,
            updatedBy: 'system',
            username: usernameForDefaultUser,
          } ),
        },
        getServices,
      } );

      const result = await service.createDefaultOnApiStartup();

      expect( result ).toBe( false );
    } );

    test( 'returns false if adapter.get responded with null, but adapter.create returned false', async () => {
      const service = new UserService( {
        adp: {
          ...dummyAdapter,
          get: () => Promise.resolve( null ),
          create: () => Promise.resolve( false ),
        },
        getServices,
      } );

      const result = await service.createDefaultOnApiStartup();

      expect( result ).toBe( false );
    } );

    {
      const desc = (
        'returns true if adapter.get responded with null, and adapter.create returned true. \n'
        + 'checks that adapter.create is called with correct argument'
      );

      test( desc, async () => {
        const defaultUserPassword = 'password';
        envVarsNS.overrideDefaultUserPassword( defaultUserPassword );

        const create: adapterNS.Adapter[ 'create' ] = () => Promise.resolve( true );
        const mockedCreate = jest.fn( create );

        const service = new UserService( {
          adp: {
            ...dummyAdapter,
            get: () => Promise.resolve( null ),
            create: mockedCreate,
          },
          getServices,
        } );

        const result = await service.createDefaultOnApiStartup();

        expect( result ).toBe( true );

        expect( mockedCreate ).toBeCalledTimes( 1 );
        const { lastCall } = mockedCreate.mock;

        expect( lastCall ).not.toBe( undefined );
        const [ arg ] = lastCall as NonNullable< typeof lastCall >;

        expect( arg.username ).toBe( usernameForDefaultUser );
        expect( arg.status ).toBe( 'registered' );
        expect( await compare( defaultUserPassword, arg.password ) ).toBe( true );
        expect( arg.role ).toStrictEqual(
          [ UserCore.UserRole.admin, UserCore.UserRole.powerUser, UserCore.UserRole.user ],
        );

        expect( arg.createdBy ).toBe( WithHistory.SYSTEM );
        expect( arg.updatedBy ).toBe( WithHistory.SYSTEM );
        expect( arg.createdAt ).toMatch( ISO_8601_FULL );
        expect( arg.updatedAt ).toMatch( ISO_8601_FULL );


        envVarsNS.resetEnvVars( [ 'CREATE_DEFAULT_USER_WITH_THIS_PASSWORD' ] );
      } );
    }
  } );
} );
