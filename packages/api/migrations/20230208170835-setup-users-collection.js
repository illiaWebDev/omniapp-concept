/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
// eslint-disable-next-line strict, lines-around-directive,
'use strict';
const { schema } = require( '@omniapp-concept/common/dist/services/User/core' );

const clone = require( 'rfdc' )();
const omitDeep = require( 'omit-deep' );

/** @type { import('@omniapp-concept/common/dist/services/User/core')[ 'CollectionName' ] } */
const usersColName = 'users';
/** @type { import('@omniapp-concept/common/dist/services/User/core')['props']['id'] } */
const idProp = 'id';
/** @type { import('@omniapp-concept/common/dist/services/User/core')['props']['username'] } */
const usernameProp = 'username';
/** @type { import('@omniapp-concept/common/dist/Ajv/errors')['errorMessageProp'] } */
const errorMessageConst = 'errorMessage';


module.exports = ( ( /** @type { Pick< import( 'migrate-mongo' ), 'up' > } */ e ) => e )( {
  async up( db ) {
    /** @type { import( 'mongodb' ).Collection< import( '@omniapp-concept/common/dist/services/User/core' ).UserInDb > } */
    const usersCol = await db.createCollection( usersColName, {
      validator: { $jsonSchema: omitDeep( clone( schema ), [ errorMessageConst ] ) },
    } );

    await usersCol.createIndex( { [ idProp ]: 1 }, { unique: true } );
    await usersCol.createIndex( { [ usernameProp ]: 1 }, { unique: true } );

    return [];
  },
} );
