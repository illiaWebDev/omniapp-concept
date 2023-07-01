/* eslint-disable prefer-destructuring */
import { processEnvVariables } from '@illia-web-dev/types/dist/helpers/processEnvVariables';


const envVariables = processEnvVariables( [
  'NODE_ENV',
  'API_URL_FROM_BROWSER',
], {
  NODE_ENV: process.env.NODE_ENV,
  API_URL_FROM_BROWSER: process.env.API_URL_FROM_BROWSER,
} );


/** @example 'development' */
export const NODE_ENV = envVariables.NODE_ENV === 'production' ? 'production' : 'development';

/** @example 'http://localhost:3001' */
export const API_URL_FROM_BROWSER = envVariables.API_URL_FROM_BROWSER;
