import type { Application } from 'express';
import * as routesNS from '@omniapp-concept/common/dist/services/User/routes';
import { getJwtFromHttpHeaders, getLocals } from '../../utlis';


export const mount = ( app: Application ) => {
  app.post(
    routesNS.getMe.route,
    async ( req, res ) => {
      const { user: userService } = getLocals( app ).services;

      const resp: routesNS.getMe.Resp = await userService.getMe( {
        jwt: getJwtFromHttpHeaders( req ),
      } );

      res.json( resp );
    },
  );

  app.post(
    routesNS.login.route,
    async ( req, res ) => {
      const arg = req.body as routesNS.login.Arg;
      const { user: userService } = getLocals( app ).services;

      const resp: routesNS.login.Resp = await userService.login( arg );

      res.json( resp );
    },
  );

  app.post(
    routesNS.register.route,
    async ( req, res ) => {
      const arg = req.body as routesNS.register.Arg;
      const { user: userService } = getLocals( app ).services;

      const resp: routesNS.register.Resp = await userService.register( arg );

      res.json( resp );
    },
  );

  app.post(
    routesNS.getListForAdmin.route,
    async ( req, res ) => {
      const { user: userService } = getLocals( app ).services;

      const resp: routesNS.getListForAdmin.Resp = await userService.getListForAdmin( {
        jwt: getJwtFromHttpHeaders( req ),
      } );

      res.json( resp );
    },
  );

  app.post(
    routesNS.approveRegRequest.route,
    async ( req, res ) => {
      const { user: userService } = getLocals( app ).services;

      const body = req.body as routesNS.approveRegRequest.Arg;
      const resp: routesNS.approveRegRequest.Resp = await userService.approveRegRequest( {
        jwt: getJwtFromHttpHeaders( req ),
        ...body,
      } );

      res.json( resp );
    },
  );
};
