import type { Request } from 'express';

export const getJwtFromHttpHeaders = ( req: Request ): string | undefined => (
  ( req.headers.authorization || '' ).replace( /^bearer\s+/i, '' )
);
