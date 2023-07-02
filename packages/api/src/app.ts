import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { getEnvVars } from './utlis/envVariables';
import { logger, catchAllRouter, getLocals } from './utlis';
import * as servicesNS from './services';
import * as servicesSetup from './app_servicesSetup';


export const init = async () => {
  process.on( 'unhandledRejection', ( reason, p ) => {
    logger.log( { level: 'error', msg: `vC05Yx4A2u | Unhandled Rejection at: Promise ${ reason }` } );
    console.error( 'vC05Yx4A2u', p, JSON.stringify( reason, null, 2 ) );
  } );

  process.on( 'uncaughtException', ( e, errOrigin ) => {
    logger.log( { level: 'error', msg: `it2uCx4A05Y | Uncaught exception ${ errOrigin }; ${ e.message }` } );
    console.error( 'it2uCx4A05Y', e, errOrigin );
  } );

  // ===================================================================================

  const { HOST, PORT } = getEnvVars();
  const app = await servicesSetup.init();

  app.use( helmet() );
  app.use( cors() );
  app.use( compression() );
  app.use( express.json() );
  app.use( express.urlencoded( { extended: true } ) );


  servicesNS.User.routes.mount( app );


  app.use( catchAllRouter );


  const server = app.listen( PORT, () => (
    logger.log( { level: 'info', msg: `Application started on ${ HOST }:${ PORT }` } )
  ) );

  process.on( 'SIGTERM', () => {
    logger.log( { level: 'debug', msg: '6LtNKn7yLC | SIGTERM signal received: closing HTTP server' } );

    server.close( () => {
      logger.log( { level: 'debug', msg: '6LtNKn7yLC | HTTP server closed' } );

      getLocals( app ).dbClient.close();
    } );
  } );
};
