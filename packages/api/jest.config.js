// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
require( 'dotenv' ).config( {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  path: require( 'path' ).resolve( __dirname, './.jest.env' ),
} );


const { NODE_ENV, JEST_COVERAGE } = process.env;

const nodeEnvConst = 'DANGER_JEST_ONLY_NODE_ENV';
if ( NODE_ENV !== nodeEnvConst ) {
  throw new Error( `Must set NODE_ENV=${ nodeEnvConst } to run tests` );
}

// JEST_TEST_TAGS=db:0
// JEST_TEST_TAGS="RegistrationRequest:1;adapter:1"


/** @type { import( 'jest' ).Config } */
const config = {
  verbose: true,
  preset: 'ts-jest',
  testPathIgnorePatterns: [ '/node_modules/', '_UNUSED_', '_DEPRECATED_' ],
  ...( JEST_COVERAGE === undefined ? {} : {
    collectCoverage: true,
    collectCoverageFrom: [
      './src/**',
      './migrations/**',
    ],
  } ),
};

module.exports = config;
