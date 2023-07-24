import type { Collection, Db } from 'mongodb';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import * as CoreNS from '@omniapp-concept/common/dist/services/User/core';
import * as createNS from './create';
import * as getNS from './get';
import * as getAuthPartsNS from './getAuthParts';
import * as getListNS from './getList';
import * as patchNS from './patch';


export class UserServiceAdapter implements adapterNS.Adapter {
  __col: Collection< CoreNS.UserInDb >;

  constructor( db: Db ) {
    this.__col = db.collection< CoreNS.UserInDb >( CoreNS.CollectionName );
  }

  // ===================================================================================

  create = ( arg: adapterNS.create.Arg ): Promise< adapterNS.create.Resp > => (
    createNS._( { arg, col: this.__col } )
  );


  get = ( arg: adapterNS.get.Arg ): Promise< adapterNS.get.Resp > => (
    getNS._( { col: this.__col, arg } )
  );


  getAuthParts = ( query: adapterNS.getAuthParts.Arg ): Promise< adapterNS.getAuthParts.Resp > => (
    getAuthPartsNS._( { col: this.__col, query } )
  );

  getList = (): Promise< adapterNS.getList.Resp > => (
    getListNS._( { col: this.__col } )
  );

  patch = ( arg: adapterNS.patch.Arg ): Promise< adapterNS.patch.Resp > => (
    patchNS._( { col: this.__col, arg } )
  );
}
