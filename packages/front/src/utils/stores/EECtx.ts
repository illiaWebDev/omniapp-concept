import * as EECtxNSLib from '@illia-web-dev/react-utils/dist/EECtx';
import * as portalEECtx from '@illia-web-dev/react-utils/dist/portal/EECtx';


export type EECtxStore = {
  portal: portalEECtx.State;
};


const rootReducer: EECtxNSLib.StoreNS.Reducer< EECtxStore > = EECtxNSLib.StoreNS.combineReducers( {
  portal: portalEECtx.reducer,
} );
export const EECtxNS = EECtxNSLib.init< EECtxStore >( {
  rootReducer,
  displayNamePrefix: 'omniapp-concept-eeCtx',
} );
