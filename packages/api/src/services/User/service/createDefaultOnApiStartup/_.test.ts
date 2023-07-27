// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, jest, beforeAll, afterAll } from '@jest/globals';
import { compare } from 'bcrypt';
import type { UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import { usernameForDefaultUser } from '@omniapp-concept/common/dist/services/User/core';
import * as WithHistory from '@omniapp-concept/common/dist/services/_common/WithHistory';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import * as UserCore from '@omniapp-concept/common/dist/services/User/core';
import { ISO_8601_FULL } from '@omniapp-concept/common/dist/helpers';
import * as createDefaultOnApiStartupNS from './main';
import * as envVarsNS from '../../../../utlis/envVariables';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../../utlis/logger';
import { describeWithTags } from '../../../../utlis/jest';
import { serviceTagsArr, dummyAdapter, full } from '../../__testUtils';


const tags = serviceTagsArr.concat( 'createDefaultOnApiStartup', 'dummyAdapter' );
describeWithTags( tags, tags.join( ' > ' ), () => {
  beforeAll( () => {
    switchLoggerToErrorLevel();
  } );
  afterAll( () => {
    resetLogLevel();
  } );


  test( 'returns false if adapter.get responded with user in db', async () => {
    const result = await createDefaultOnApiStartupNS._( {
      adapter: {
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
      defaultUserPassword: '',
    } );

    expect( result ).toBe( false );
  } );

  test( 'returns false if adapter.get responded with null, but adapter.create returned false', async () => {
    const result = await createDefaultOnApiStartupNS._( {
      adapter: {
        ...dummyAdapter,
        get: () => Promise.resolve( null ),
        create: () => Promise.resolve( false ),
      },
      defaultUserPassword: '',
    } );

    expect( result ).toBe( false );
  } );

  {
    const desc = (
      'returns true if adapter.get responded with null, and adapter.create returned true. \n'
      + 'checks that adapter.create is called with correct argument'
    );

    test( desc, async () => {
      const defaultUserPassword = 'password';

      const create: adapterNS.Adapter[ 'create' ] = () => Promise.resolve( true );
      const mockedCreate = jest.fn( create );


      const result = await createDefaultOnApiStartupNS._( {
        adapter: {
          ...dummyAdapter,
          get: () => Promise.resolve( null ),
          create: mockedCreate,
        },
        defaultUserPassword,
      } );

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


      envVarsNS.resetDefaultUserPasswordForJest();
    } );
  }
} );
