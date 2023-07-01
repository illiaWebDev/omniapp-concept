/* eslint-disable import/no-extraneous-dependencies,import/no-import-module-exports */
import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import * as PortalCompNS from '@illia-web-dev/react-utils/dist/portal/Comp';
import { store } from '@utils/stores/redux';
import { EECtxNS } from '@utils/stores/EECtx';
import { usePortals } from '@utils/stores/EECtx_portal';
import { App } from './parts/App';


if ( module.hot ) {
  module.hot.accept();
}


// Registering Service Worker
if ( 'serviceWorker' in navigator ) navigator.serviceWorker.register( '/sw.js' );

const app = document.getElementById( 'app' );
if ( !app ) throw new Error( 'no #app in ./src/index' );


const root = createRoot( app );
root.render(
  <EECtxNS.WithCtx>
    <Provider store={ store }>
      <App />

      <ToastContainer />
      <PortalCompNS.RootNS._ usePortals={ usePortals } />
    </Provider>
  </EECtxNS.WithCtx>,
);
