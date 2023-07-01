import type { TFailureRes } from '@illia-web-dev/types/dist/types/CommonRes';
import { Router, ErrorRequestHandler } from 'express';
import { logger } from './logger';

export const catchAllRouter = Router();

catchAllRouter.use( ( req, res ) => {
  logger.log( { level: 'debug', msg: `ggJTIaSTfF | ${ req.originalUrl }` } );

  const resp: TFailureRes< '404 - FbEXOjznRd' > = { success: false, error: '404 - FbEXOjznRd' };
  res.status( 404 ).json( resp );
} );


const errRequestHandler: ErrorRequestHandler = ( err, _, res ) => {
  if ( err ) {
    logger.log( { level: 'error', msg: `Lo3tpnE4Me | ${ err }` } );
    console.error( err );

    const resp: TFailureRes< '500' > = { success: false, error: '500' };
    res.status( 500 ).json( resp );
  }
};
catchAllRouter.use( errRequestHandler );
