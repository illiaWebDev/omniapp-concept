// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect } from '@jest/globals';
import { SYSTEM } from '@omniapp-concept/common/dist/services/_common/WithHistory';
import { compare } from 'bcrypt';
import type { UserId } from '@omniapp-concept/common/dist/helpers';
import { hydrateUser, HydrateUser } from './main';
import { describeWithTags } from '../../../../utlis/jest';
import { serviceTagsArr } from '../../__testUtils';


const tagsArr = serviceTagsArr.concat( '__hydrateUser' );
describeWithTags( tagsArr, tagsArr.join( ' > ' ), () => {
  const password = 'password';
  const commonUserData: Parameters< HydrateUser >[ 0 ][ 'userData' ] = {
    password,
    role: [ 'admin' ],
    status: 'registered',
    username: '',
  };

  test( 'successfully hydrates with SYSTEM', async () => {
    const arg: Parameters< HydrateUser >[ 0 ] = {
      authorId: null,
      userData: commonUserData,
    };
    const user = await hydrateUser( arg );

    expect( user.username ).toStrictEqual( arg.userData.username );
    expect( await compare( arg.userData.password, user.password ) ).toBe( true );
    expect( user.role ).toStrictEqual( arg.userData.role );
    expect( user.status ).toStrictEqual( arg.userData.status );

    expect( user.createdBy ).toBe( SYSTEM );
    expect( user.updatedBy ).toBe( SYSTEM );
  } );

  test( 'successfully hydrates with author', async () => {
    const arg: Parameters< HydrateUser >[ 0 ] = {
      authorId: 'authorId' as UserId,
      userData: commonUserData,
    };
    const user = await hydrateUser( arg );

    expect( user.createdBy ).toBe( arg.authorId );
    expect( user.updatedBy ).toBe( arg.authorId );
  } );
} );
