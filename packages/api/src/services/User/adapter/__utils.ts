import type * as CoreNS from '@omniapp-concept/common/dist/services/User/core';
import type { Props as WithObjIdProps } from '@omniapp-concept/common/dist/services/_common/WithObjId';
import { noMongoIdProjection } from '../../__common';


export type UserNoDbOnlyFieldsProjectionT = Record< CoreNS.UserDbOnlyFields | WithObjIdProps, 0 >;
export const userNoDbOnlyFieldsProjection: UserNoDbOnlyFieldsProjectionT = {
  ...noMongoIdProjection,
  password: 0,
};
