// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect } from '@jest/globals';
import type { UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import { decodeJWT } from '@omniapp-concept/common/dist/services/User/authParts';
import { getFull } from '@illia-web-dev/types/dist/types/ISO8601/UTC';
import { EpochSecond } from '@illia-web-dev/types/dist/types';
import { getJwt } from './main';
import { describeWithTags } from '../../../../utlis/jest';
import { tags } from '../../__testUtils';


const tagsArr = [ tags.UserService, '__getJwt' ];
describeWithTags( tagsArr, tagsArr.join( ' > ' ), () => {
  test( 'creates jwt successfully', () => {
    const userId = 'userId' as UserId;

    const now = Math.floor( new Date( getFull() ).getTime() / 1_000 ) as EpochSecond;
    const jwt = getJwt( {
      id: userId,
      jwtExpiresIn: '10m',
      jwtSecret: 'secret',
    } );

    expect( jwt ).toBeTruthy();

    const { sub, exp, iat } = decodeJWT( jwt );

    expect( sub ).toBe( userId );
    expect( iat - now ).toBeLessThan( 1 );
    expect( exp - iat ).toBe( 600 );
  } );
} );
