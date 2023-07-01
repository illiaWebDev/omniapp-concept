import React from 'react';
import type { UserRoleT } from '@omniapp-concept/common/dist/services/User/core';
import { useIsAllowed } from '../hooks/useIsAllowed';

// ===================================================================================

export type ShowBasedOnRoleProps = React.PropsWithChildren<{
  allowedRoles: UserRoleT[];
}>;

export const ShowBasedOnRole: React.FC< ShowBasedOnRoleProps > = React.memo( p => {
  const { allowedRoles, children } = p;


  return useIsAllowed( allowedRoles )
  // eslint-disable-next-line react/jsx-no-useless-fragment
    ? <>{ children }</>
    : null;
} );
ShowBasedOnRole.displayName = 'parts/Auth/Comp/ShowBasedOnRole';
