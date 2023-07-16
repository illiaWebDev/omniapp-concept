/* eslint-disable prefer-destructuring */
import { processEnvVariables } from '@illia-web-dev/types/dist/helpers/processEnvVariables';
import { loggerEnvVarNames, LoggerEnvVars, getLoggerEnvVars } from '@illia-web-dev/logger';


export const envVarNames = {
  NODE_ENV: 'NODE_ENV',
  HOST: 'HOST',
  PORT: 'PORT',
  MONGO_URI: 'MONGO_URI',
  JWT_SECRET: 'JWT_SECRET',
  JWT_EXPIRES_IN: 'JWT_EXPIRES_IN',

  CREATE_DEFAULT_USER_WITH_THIS_PASSWORD: 'CREATE_DEFAULT_USER_WITH_THIS_PASSWORD',

  [ loggerEnvVarNames.LOG_TAGS ]: loggerEnvVarNames.LOG_TAGS,
  [ loggerEnvVarNames.LOG_LEVEL ]: loggerEnvVarNames.LOG_LEVEL,
} as const;


export type Rtrn = {
  /** @example 'production' */
  [ envVarNames.NODE_ENV ]: string;
  /** @example 3001 */
  [ envVarNames.PORT ]: number;
  /** @example 'localhost' */
  [ envVarNames.HOST ]: string;
  /** @example 'mongodb://127.0.0.1:27017/omniapp_concept' */
  [ envVarNames.MONGO_URI ]: string;
  /** @example 'my-super-secret' */
  [ envVarNames.JWT_SECRET ]: string;
  /**
   * @see https://github.com/vercel/ms
   * @example '365d', '1y', '2h', '-10s'
   */
  [ envVarNames.JWT_EXPIRES_IN ]: string;


  /**
   * holds password for default user that should be created on startup
   * @example '953XYddUAwxC3nRfK6d'
   */
  [ envVarNames.CREATE_DEFAULT_USER_WITH_THIS_PASSWORD ]: string;


  [ envVarNames.LOG_TAGS ]: LoggerEnvVars[ 'LOG_TAGS' ];
  [ envVarNames.LOG_LEVEL ]: LoggerEnvVars[ 'LOG_LEVEL' ];
};

// this is needed so that we can redefine env vars in tests, for example
// and then run initialization of smth. If we would define those statically
// we would not be able to redegine these
export const getEnvVars = (): Rtrn => {
  const { LOG_LEVEL, LOG_TAGS } = getLoggerEnvVars( process.env );

  const envVariables = processEnvVariables( [
    'NODE_ENV',
    'HOST',
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'CREATE_DEFAULT_USER_WITH_THIS_PASSWORD',
  ], process.env );

  return {
    [ envVarNames.NODE_ENV ]: envVariables.NODE_ENV === 'production' ? 'production' : 'development',
    [ envVarNames.PORT ]: Number( envVariables.PORT ),
    [ envVarNames.HOST ]: envVariables.HOST,
    [ envVarNames.MONGO_URI ]: envVariables.MONGO_URI,
    [ envVarNames.JWT_SECRET ]: envVariables.JWT_SECRET,
    [ envVarNames.JWT_EXPIRES_IN ]: envVariables.JWT_EXPIRES_IN,
    [ envVarNames.CREATE_DEFAULT_USER_WITH_THIS_PASSWORD ]: envVariables.CREATE_DEFAULT_USER_WITH_THIS_PASSWORD,
    LOG_LEVEL,
    LOG_TAGS,
  };
};

// ===================================================================================
// basically these are helpers mainly for testing, so that we can make
// really specific process.env changes in response to what exactly
// should be tweaked for particular test

// will store exact env that whole process was launched with, so that we can
// seamlessly restore whatever we change during tests
const originalEnv = JSON.parse( JSON.stringify( process.env ) ) as typeof process.env;
export const resetEnvVars = ( names: Array< keyof typeof envVarNames > ) => {
  names.forEach( name => {
    process.env[ name ] = originalEnv[ name ];
  } );
};


export const overrideLogLevel = ( v?: string ) => {
  if ( v === undefined ) delete process.env[ envVarNames.LOG_LEVEL ];
  else process.env[ envVarNames.LOG_LEVEL ] = v;
};

export const overrideMongoUriForJest = ( suffix: string ) => {
  if ( suffix.length >= 15 ) throw new Error( 'DipoA6ZsuZ | suffix is meant to be short unique string' );

  process.env[ envVarNames.MONGO_URI ] = `mongodb://localhost:27017/ominapp-concept-dHdjE4FMoP-${ suffix }`;
};

export const overrideDefaultUserPassword = ( v: string ) => {
  process.env[ envVarNames.CREATE_DEFAULT_USER_WITH_THIS_PASSWORD ] = v;
};

export const overrideJwtSecret = ( v: string ) => {
  process.env[ envVarNames.JWT_SECRET ] = v;
};
export const overrideJwtExpiresIn = ( v: string ) => {
  process.env[ envVarNames.JWT_EXPIRES_IN ] = v;
};

// export const overrideHost = ( v: string ) => {
//   process.env[ envVarNames.HOST ] = v;
// };
// export const overridePort = ( v: string ) => {
//   process.env[ envVarNames.PORT ] = v;
// };
