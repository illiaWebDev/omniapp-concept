import { Logger, getLoggerEnvVars } from '@illia-web-dev/logger';
import { getEnvVars, overrideLogLevel, resetEnvVars } from './envVariables';

const { LOG_LEVEL, LOG_TAGS } = getEnvVars();


export const logger = new Logger( { level: LOG_LEVEL, tags: LOG_TAGS } );


export const switchLoggerToErrorLevel = () => {
  overrideLogLevel();

  const { LOG_LEVEL, LOG_TAGS } = getLoggerEnvVars( process.env );
  logger.reinit( { level: LOG_LEVEL, tags: LOG_TAGS } );
};
export const resetLogLevel = () => {
  resetEnvVars( [ 'LOG_LEVEL' ] );


  const { LOG_LEVEL, LOG_TAGS } = getLoggerEnvVars( process.env );
  logger.reinit( { level: LOG_LEVEL, tags: LOG_TAGS } );
};
