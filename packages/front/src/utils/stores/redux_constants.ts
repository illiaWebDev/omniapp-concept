import { useSelector } from 'react-redux';
import type * as LocationNS from '../location';
import type * as AuthNS from '../../parts/Auth';
import type * as AdminNS from '../../parts/Adminpanel';


export type RootState = {
  [ AuthNS.reducer.REDUX_PROP ]: AuthNS.reducer.State;
  [ LocationNS.REDUX_PROP ]: LocationNS.State;
  [ AdminNS.reducer.REDUX_PROP ]: AdminNS.reducer.State;
};

export type AllActions = (
  | AuthNS.reducer.AllActions
  | LocationNS.AllActions
  | AdminNS.reducer.AllActions
);


export const useTypedSelector: < T >( f: ( s: RootState ) => T ) => T = useSelector;
