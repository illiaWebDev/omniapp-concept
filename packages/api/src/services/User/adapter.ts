import type { Collection, Db } from 'mongodb';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import * as CoreNS from '@omniapp-concept/common/dist/services/User/core';
import type { Props as WithObjIdProps } from '@omniapp-concept/common/dist/services/_common/WithObjId';
import { noMongoIdProjection } from '../__common';


type NoDbOnlyFieldsProjectionT = Record< CoreNS.UserDbOnlyFields | WithObjIdProps, 0 >;
const noDbOnlyFieldsProjection: NoDbOnlyFieldsProjectionT = {
  ...noMongoIdProjection,
  password: 0,
};

type KeysToIncludeInUserForJwt = keyof adapterNS.getAuthParts.SuccessResp;
const projectionForGetUserForJwt: Record< KeysToIncludeInUserForJwt, 1 > & Record< WithObjIdProps, 0 > = {
  ...noMongoIdProjection,
  [ CoreNS.props.password ]: 1,
  [ CoreNS.props.id ]: 1,
  [ CoreNS.props.role ]: 1,
} as const;


export class UserServiceAdapter implements adapterNS.Adapter {
  __col: Collection< CoreNS.UserInDb >;

  constructor( db: Db ) {
    this.__col = db.collection< CoreNS.UserInDb >( CoreNS.CollectionName );
  }


  // ===================================================================================

  create = ( arg: adapterNS.create.Arg ): Promise< adapterNS.create.Resp > => this.__col
    .insertOne( arg )
    .then( () => true )
    .catch( () => false );


  get = ( arg: adapterNS.get.Arg ): Promise< adapterNS.get.Resp > => (
    this.__col.findOne( arg, { projection: noDbOnlyFieldsProjection } )
  );


  async getAuthParts( arg: adapterNS.getAuthParts.Arg ): Promise< adapterNS.getAuthParts.Resp > {
    const { type, ...query } = arg;
    const resp = await this.__col
      .findOne(
        query,
        { projection: projectionForGetUserForJwt },
      ) as Pick< CoreNS.UserInDb, KeysToIncludeInUserForJwt > | null;

    return resp;
  }

  getList(): Promise< adapterNS.getList.Resp > {
    return this.__col.find(
      {},
      { projection: noDbOnlyFieldsProjection },
    ).toArray();
  }

  patch( { id, data: $set }: adapterNS.patch.Arg ): Promise< adapterNS.patch.Resp > {
    return this.__col.updateOne( { id }, { $set } )
      .then( () => true );
  }
}
