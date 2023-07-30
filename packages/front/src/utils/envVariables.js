// eslint-disable-next-line @typescript-eslint/no-var-requires
const { processEnvVariables } = require( '@illia-web-dev/types/dist/helpers/processEnvVariables' );


const envVarNames = /** @type { const } */( {
  NODE_ENV: 'NODE_ENV',
  API_URL_PREFIX: 'API_URL_PREFIX',
} );

const envVariables = processEnvVariables( [
  envVarNames.NODE_ENV,
  envVarNames.API_URL_PREFIX,
], {
  [ envVarNames.NODE_ENV ]: process.env.NODE_ENV,
  [ envVarNames.API_URL_PREFIX ]: process.env.API_URL_PREFIX,
} );

const combined = {
  /** @example 'development' */
  [ envVarNames.NODE_ENV ]: envVariables[ envVarNames.NODE_ENV ] === 'production' ? 'production' : 'development',
  /**
   * denotes prefix on "front server" (which is kinda "ephemeral",\
   * as it is webpcak-dev-server in dev and nginx in prod, but not\
   * some expressjs server)
   */
  [ envVarNames.API_URL_PREFIX ]: envVariables[ envVarNames.API_URL_PREFIX ],
};

module.exports = combined;
