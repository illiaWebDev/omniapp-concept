import { Collection, MongoError } from 'mongodb';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import type * as CoreNS from '@omniapp-concept/common/dist/services/User/core';


export type Arg = {
  col: Collection< CoreNS.UserInDb >;
  arg: adapterNS.create.Arg;
};
export const _ = ( { arg, col }: Arg ): Promise< adapterNS.create.Resp > => (
  col.insertOne( arg )
    .then( () => true )
    .catch( e => {
      if ( e instanceof MongoError && e.message.startsWith( 'E11000' ) ) {
        return false;
      }

      throw e;
    } )
);
