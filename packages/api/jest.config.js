// @ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require( 'path' );
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require( 'fs' );


// ===================================================================================

const jestEnvPath = path.resolve( __dirname, './.jest.env' );
if ( fs.existsSync( jestEnvPath ) === false ) {
  throw new Error( 'BP2jEm1JKl | require .jest.env to function' );
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
require( 'dotenv' ).config( { path: jestEnvPath } );

// ===================================================================================

// eslint-disable-next-line no-process-env
const { NODE_ENV, MONGO_URI, JEST_COVERAGE } = process.env;

const nodeEnvConst = 'DANGER_JEST_ONLY_NODE_ENV';
if ( NODE_ENV !== nodeEnvConst ) {
  throw new Error( `Must set NODE_ENV=${ nodeEnvConst } to run tests` );
}

// ===================================================================================


if ( MONGO_URI === undefined || MONGO_URI.indexOf( '-dHdjE4FMoP-' ) === -1 ) {
  throw new Error( '6o9nx9zOQa | Failed test for correct jest env' );
}


// ===================================================================================

// JEST_TEST_TAGS=db:0
// JEST_TEST_TAGS="RegistrationRequest:1;adapter:1"


/** @type { import( 'jest' ).Config } */
const config = {
  verbose: true,
  preset: 'ts-jest',
  testPathIgnorePatterns: [ '/node_modules/', '_UNUSED_', '_DEPRECATED_', 'dist' ],
  ...( JEST_COVERAGE === undefined ? {} : {
    collectCoverage: true,
    collectCoverageFrom: [
      './src/**',
      './migrations/**',
    ],
  } ),
};

module.exports = config;
