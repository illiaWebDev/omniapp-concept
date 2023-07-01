import React from 'react';
import * as portalNS from '@illia-web-dev/react-utils/dist/portal';
import { EECtxNS } from './EECtx';


const { pushPortal, popPortal } = portalNS.aCreators;

export type UsePortalRtrn = {
  show: ( arg: Parameters< typeof pushPortal >[ 0 ] ) => unknown;
  close: () => unknown;
};

export const usePortal: () => UsePortalRtrn = () => {
  const dispatch = EECtxNS.useDispatch();

  return React.useMemo< UsePortalRtrn >( () => ( {
    show: arg => dispatch( pushPortal( arg ) ),
    close: () => dispatch( popPortal() ),
  } ), [ dispatch ] );
};

export type PortalComp = portalNS.PortalComp;


export const usePortals: portalNS.CompNS.RootNS.Props[ 'usePortals' ] = (
  () => EECtxNS.useSelector( s => s.portal.portals )
);
