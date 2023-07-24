import type { Collection } from 'mongodb';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import type * as CoreNS from '@omniapp-concept/common/dist/services/User/core';


export type Arg = {
  col: Collection< CoreNS.UserInDb >;
  arg: adapterNS.patch.Arg;
};
export const _ = ( { col, arg: { id, data: $set } }: Arg ): Promise< adapterNS.patch.Resp > => (
  col.updateOne( { id }, { $set } )
    .then( () => true )
);
