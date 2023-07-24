import { hash } from 'bcrypt';
import type { SafeOmit } from '@illia-web-dev/types/dist/types/Omit';
import { getUserId, UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import * as CoreNS from '@omniapp-concept/common/dist/services/User/core';
import type { HistoryProps } from '@omniapp-concept/common/dist/services/_common/WithHistory';
import type { BcryptPassword } from '@illia-web-dev/types/dist/types/BcryptPassword';
import { addWithHistory } from '../../../__common';


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
export const hydrateUser: HydrateUser = async ( { userData, authorId } ) => {
  const user: CoreNS.UserInDb = {
    id: getUserId(),
    ...addWithHistory( {}, authorId ),
    ...userData,
    password: ( await hash( userData.password, CoreNS.SALT_ROUNDS ) ) as BcryptPassword,
  };

  return user;
};
