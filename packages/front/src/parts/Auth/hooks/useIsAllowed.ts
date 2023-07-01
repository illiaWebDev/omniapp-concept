import React from 'react';
import { matchesAllowedRole, UserRoleT } from '@omniapp-concept/common/dist/services/User/core';
import { useUser } from './useUser';


export const useIsAllowed = ( allowedRoles: UserRoleT[] ) => {
  const user = useUser();

  return React.useMemo( () => (
    user !== null && matchesAllowedRole( allowedRoles, user.role )
  ), [ user, allowedRoles ] );
};
