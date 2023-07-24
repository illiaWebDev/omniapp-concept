import type { Collection } from 'mongodb';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import * as CoreNS from '@omniapp-concept/common/dist/services/User/core';
import { userNoDbOnlyFieldsProjection } from '../__utils';


export type Arg = {
  col: Collection< CoreNS.UserInDb >;
};
export const _ = ( { col }: Arg ): Promise< adapterNS.getList.Resp > => (
  col.find(
    {},
    { projection: userNoDbOnlyFieldsProjection },
  ).toArray()
);
