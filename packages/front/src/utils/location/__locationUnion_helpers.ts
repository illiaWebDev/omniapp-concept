import type { LocationsUnion } from './__locationUnionT';


// ===================================================================================

/**
 * used to map starting url in browser (in web, and similar \
 * in react-native and others) to LocationsUnion. Should be \
 * exported from all available location files to allow opening\
 * maching location right away
 */
export type RouteToLocationOnBootstrap = ( route: string ) => LocationsUnion | null;

/**
 * used when we persist location change to some platform\
 * specific place (like url in web browser)
 */
export type LocationToRoute = ( l: LocationsUnion ) => string | null;


// ===================================================================================


/**
 * before navigate sagas in each location serve as\
 * as gateway before that location, allowing us to\
 * override control and forbid access to location or \
 * perhaps preload smth, etc.\
 * In order to be explicit about that, each of thse \
 * sagas should return this type, stating whether it\
 * took control and finalized requestToSetLocation \
 * itself or that we can proceed to the location as\
 * usual.
 */
export type BeforeNavigateSagaRtrn = 'overrideHappened' | 'noOverrideHappened';

/**
 * used before navigating to some location as a way to\
 * check smth, make some adjustments, initiate load of smth\
 * or maybe completely forbid opening such url for some\
 * reason (access control).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BeforeNavigateSaga = ( location: LocationsUnion ) => Generator< unknown, BeforeNavigateSagaRtrn, any >;
