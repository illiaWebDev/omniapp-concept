import type { ACreators } from '@illia-web-dev/types/dist/types/ACreators';
import type { RecordValues } from '@illia-web-dev/types/dist/types/RecordValues';
import type { LocationsUnion } from './__locationUnionT';


export const REDUX_PROP = 'location';
export type State = {
  state: LocationsUnion;
  /**
   * contains all locations we visited before current,\
   * i.e if we started from { route: '' }, then navigated\
   * to { route: '/login' }, then to { route: '/'}, state would be
   * ```
   * {
   *   state: { route: '/' },
   *   history: [{ route: '' }, { route: '/login' }]
   * }
   * ```
   */
  history: State[ 'state' ][];
};
export const defaultState: State = {
  state: { route: '' },
  history: [],
};


export const aTypes = {
  requestToSetLocation: 'location/request-to-set-location',
  setLocation: 'location/set-location',
} as const;


export type Actions = {
  /**
   * main idea behind this is to make navigation also completely\
   * redux based, meaning that location is not a browser \
   * characteristic, for us - it is a property in our redux store\
   * and the whole app becomes redux first. It just happens so\
   * that we are able to sync with URL on startup and we align\
   * browser URL after we processed requestToNavigate, but that\
   * is rather a facade than the source of truth for our app
   */
  requestToSetLocation: {
    type: typeof aTypes.requestToSetLocation;
    payload: {
      state: State[ 'state' ];
      /**
       * perhaps we don't want to push to history, but instead\
       * want to replace - then we set this to true
       */
      replace?: true;
      /**
       * marks this call as "override" meaning that some location's\
       * beforeNavigate decided to take control and override initial\
       * requestToSetLocation
       */
      isOverride?: true;
    };
  };
  setLocation: {
    type: typeof aTypes.setLocation;
    payload: Actions[ 'requestToSetLocation' ][ 'payload' ];
  };
};
export type AllActions = RecordValues< Actions >;


export const aCreators: ACreators< Actions > = {
  requestToSetLocation: p => ( { type: aTypes.requestToSetLocation, payload: p } ),
  setLocation: p => ( { type: aTypes.setLocation, payload: p } ),
};


export const reducer = ( s: State = defaultState, a: AllActions ): State => {
  switch ( a.type ) {
    case aTypes.setLocation: {
      const { state, replace } = a.payload;
      const { history, state: prevState } = s;
      const nextHistory = replace === undefined
        ? history.concat( prevState )
        // if we replace current location state - there is no need
        // to push prev to history as that is effectively gone
        // forever
        : history;

      return {
        ...s,
        state,
        history: nextHistory,
      };
    }
    default: return s;
  }
};
