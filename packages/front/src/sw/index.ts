/* eslint-disable no-undef, no-restricted-globals */
// Files to cache

if ( module.hot ) {
  module.hot.accept();
}


const cacheName = 'omniapp-concept-v2';
void cacheName;
const appShellFiles: string[] = [
  // '/pwa-examples/js13kpwa/',
  // '/pwa-examples/js13kpwa/index.html',
  // '/pwa-examples/js13kpwa/app.js',
  // '/pwa-examples/js13kpwa/style.css',
  // '/pwa-examples/js13kpwa/fonts/graduate.eot',
  // '/pwa-examples/js13kpwa/fonts/graduate.ttf',
  // '/pwa-examples/js13kpwa/fonts/graduate.woff',
  // '/pwa-examples/js13kpwa/favicon.ico',
  // '/pwa-examples/js13kpwa/img/js13kgames.png',
  // '/pwa-examples/js13kpwa/img/bg.png',
  // '/pwa-examples/js13kpwa/icons/icon-32.png',
  // '/pwa-examples/js13kpwa/icons/icon-64.png',
  // '/pwa-examples/js13kpwa/icons/icon-96.png',
  // '/pwa-examples/js13kpwa/icons/icon-128.png',
  // '/pwa-examples/js13kpwa/icons/icon-168.png',
  // '/pwa-examples/js13kpwa/icons/icon-192.png',
  // '/pwa-examples/js13kpwa/icons/icon-256.png',
  // '/pwa-examples/js13kpwa/icons/icon-512.png',
];
// const gamesImages = [];
// for ( let i = 0; i < games.length; i++ ) {
//   gamesImages.push( `data/img/${ games[ i ].slug }.jpg` );
// }
const contentToCache = appShellFiles;
void contentToCache;


const sw = self as unknown as ServiceWorkerGlobalScope;

// Installing Service Worker
sw.addEventListener( 'install', e => {
  console.info( '[Service Worker] Install', e );
  // e.waitUntil( ( async () => {
  //   const cache = await caches.open( cacheName );
  //   console.log( '[Service Worker] Caching all: app shell and content' );
  //   await cache.addAll( contentToCache );
  // } )() );
} );

sw.addEventListener( 'activate', e => {
  console.info( '[Service Worker] act5', e );
} );

// Fetching content using Service Worker
// sw.addEventListener( 'fetch', e => {
//   e.respondWith( ( async () => {
//     await ( async () => {
//       if ( e.request.url.startsWith( 'http' ) === false ) {
//         return;
//       }

//       console.log( `[Service Worker] Skipped caching resource ${ e.request.url }` );

//       // const r = await caches.match( e.request );

//       // if ( r ) return r;
//       // const response = await;
//       // const cache = await caches.open( cacheName );
//       // console.log( `[Service Worker] Caching new resource: ${ e.request.url }` );
//       // cache.put( e.request, response.clone() );
//     } )();

//     console.log( `[Service Worker] Fetching resource: ${ e.request.url }` );
//     return fetch( e.request );
//   } )() );
// } );
