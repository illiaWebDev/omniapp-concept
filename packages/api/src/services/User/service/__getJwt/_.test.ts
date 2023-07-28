// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect } from '@jest/globals';
import { verify } from 'jsonwebtoken';
import type { UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import { decodeJWT } from '@omniapp-concept/common/dist/services/User/authParts';
import { getFull } from '@illia-web-dev/types/dist/types/ISO8601/UTC';
import type { EpochSecond, Millisecond } from '@illia-web-dev/types/dist/types/Time';
import { getJwt } from './main';
import { describeWithTags } from '../../../../utlis/jest';
import { serviceTagsArr } from '../../__testUtils';


const tagsArr = serviceTagsArr.concat( '__getJwt' );
describeWithTags( tagsArr, tagsArr.join( ' > ' ), () => {
  test( 'creates jwt successfully', () => {
    const userId = 'userId' as UserId;
    const jwtSecret = 'secret';
    const expiresIn = 600_000 as Millisecond;

    const now = Math.floor( new Date( getFull() ).getTime() / 1_000 ) as EpochSecond;
    const jwt = getJwt( {
      id: userId,
      jwtExpiresIn: String( expiresIn ),
      jwtSecret,
    } );

    expect( jwt ).toBeTruthy();

    expect( typeof verify( jwt, jwtSecret ) !== 'string' ).toBe( true );

    const payload = decodeJWT( jwt );

    expect( Object.keys( payload ).length ).toBe( 3 );
    const { sub, exp, iat } = payload;

    expect( sub ).toBe( userId );
    expect( iat - now ).toBeLessThan( 1 );
    expect( exp - iat ).toBe( expiresIn / 1_000 );
  } );
} );
