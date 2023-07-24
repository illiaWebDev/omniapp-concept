import type { Collection } from 'mongodb';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import type * as CoreNS from '@omniapp-concept/common/dist/services/User/core';
import { userNoDbOnlyFieldsProjection } from '../__utils';


export type Arg = {
  col: Collection< CoreNS.UserInDb >;
  arg: adapterNS.get.Arg;
};
export const _ = ( { arg, col }: Arg ): Promise< adapterNS.get.Resp > => (
  col.findOne( arg, { projection: userNoDbOnlyFieldsProjection } )
);
