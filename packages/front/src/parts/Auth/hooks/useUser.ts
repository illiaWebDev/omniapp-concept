import React from 'react';
import { useTypedSelector } from '@utils/stores/redux_constants';
import type { State } from '../reducer';


export const useUser = (): NonNullable< State[ 'data' ] >[ 'user' ] | null => {
  const data = useTypedSelector( s => s.auth.data );

  return React.useMemo( () => (
    data === null ? null : data.user
  ), [ data ] );
};
