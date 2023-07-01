import type * as location404 from '../../parts/404/locationT';
import type * as LoginLocation from '../../parts/Auth/Login/locationT';
import type * as RegisterLocation from '../../parts/Auth/Register/locationT';
import type * as MainLocation from '../../parts/Main/locationT';
import type * as AdminLocation from '../../parts/Adminpanel/locationT';


export type LocationsUnion = (
  /**
   * denotes really "uninitialized" state of location, meaning\
   * before auto auth was triggered. Previously I thought, that\
   * we can use '/' as defualt state, but that is wrong as if,\
   * for example, '/' displays some kind of dashboard - we would\
   * try to preload it upon requestToNavigate, and that makes no\
   * sense if we are unauthorized. So we should have some state\
   * that means "completely empty and shallow state, without any\
   * initialization, app should be unusable with such state"
   */
  | { route: '' }
  | location404.State
  | LoginLocation.State
  | RegisterLocation.State
  | MainLocation.State
  | AdminLocation.State
);
