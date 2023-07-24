import { Logger, getLoggerEnvVars } from '@illia-web-dev/logger';
import { getEnvVars, overrideLogLevel, resetLogLevel as envVarsResetLogLevel } from './envVariables';

const { LOG_LEVEL, LOG_TAGS } = getEnvVars();


export const logger = new Logger( { level: LOG_LEVEL, tags: LOG_TAGS } );


export const switchLoggerToErrorLevel = () => {
  overrideLogLevel();

  const { LOG_LEVEL, LOG_TAGS } = getLoggerEnvVars( process.env );
  logger.reinit( { level: LOG_LEVEL, tags: LOG_TAGS } );
};
export const resetLogLevel = () => {
  envVarsResetLogLevel();


  const { LOG_LEVEL, LOG_TAGS } = getLoggerEnvVars( process.env );
  logger.reinit( { level: LOG_LEVEL, tags: LOG_TAGS } );
};
