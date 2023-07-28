// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, jest, beforeAll, afterAll } from '@jest/globals';
import { compare } from 'bcrypt';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import { SYSTEM } from '@omniapp-concept/common/dist/services/_common/WithHistory';
import type { UserRoleT } from '@omniapp-concept/common/dist/services/User/core';
import * as registerNS from './main';
import { resetLogLevel, switchLoggerToErrorLevel } from '../../../../utlis/logger';
import { describeWithTags } from '../../../../utlis/jest';
import { serviceTagsArr, dummyAdapter } from '../../__testUtils';


const tags = serviceTagsArr.concat( 'register', 'dummyAdapter' );
describeWithTags( tags, tags.join( ' > ' ), () => {
  beforeAll( () => {
    switchLoggerToErrorLevel();
  } );
  afterAll( () => {
    resetLogLevel();
  } );


  test( 'responds with success even if adapter.create returned false', async () => {
    const username = 'username';
    const password = 'password';

    const create: adapterNS.Adapter[ 'create' ] = () => Promise.resolve( false );
    const mockedCreate = jest.fn( create );

    const result = await registerNS._( {
      adapter: { ...dummyAdapter, create: mockedCreate },
      arg: { password, username },
    } );

    expect( result.success ).toBe( true );
    expect( result.data ).toBe( 'registrationRequestCreated' );


    const { lastCall } = mockedCreate.mock;
    expect( lastCall ).toBeTruthy();

    const [ lastArg ] = lastCall as NonNullable< typeof lastCall >;

    expect( Object.keys( lastArg ).length ).toBe( 9 );

    expect( lastArg.username ).toBe( username );
    expect( await compare( password, lastArg.password ) ).toBe( true );

    const expectedRoles: UserRoleT[] = [ 'user' ];
    expect( lastArg.role ).toStrictEqual( expectedRoles );

    expect( lastArg.status ).toBe( 'registrationRequest' );
    expect( lastArg.createdBy ).toBe( SYSTEM );
    expect( lastArg.updatedBy ).toBe( SYSTEM );
  } );

  test( 'responds with success if adapter.create returned true', async () => {
    const create: adapterNS.Adapter[ 'create' ] = () => Promise.resolve( true );

    const result = await registerNS._( {
      adapter: { ...dummyAdapter, create },
      arg: { password: '', username: '' },
    } );

    expect( result.success ).toBe( true );
    expect( result.data ).toBe( 'registrationRequestCreated' );
  } );
} );
