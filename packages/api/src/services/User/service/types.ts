import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import type { GetServices } from '@omniapp-concept/common/dist/services';
import type { SafeOmit } from '@illia-web-dev/types/dist/types/Omit';
import type { UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import type * as CoreNS from '@omniapp-concept/common/dist/services/User/core';
import type { HistoryProps } from '@omniapp-concept/common/dist/services/_common/WithHistory';


export type UserServiceConstructorArg = {
  adp: adapterNS.Adapter;
  getServices: GetServices;
};


export type HydrateUser = (
  arg: {
    userData: (
      & SafeOmit<
        CoreNS.UserInDb,
        | CoreNS.UserDbOnlyFields
        | HistoryProps
        | typeof CoreNS.props.id
      >
      & { [ CoreNS.props.password ]: string }
    );
    authorId: UserId | null;
  }
) => Promise< CoreNS.UserInDb >;
