import type { Collection } from 'mongodb';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';
import * as CoreNS from '@omniapp-concept/common/dist/services/User/core';
import type { Props as WithObjIdProps } from '@omniapp-concept/common/dist/services/_common/WithObjId';
import { noMongoIdProjection } from '../../../__common';


type KeysToIncludeInAuthParts = keyof adapterNS.getAuthParts.SuccessResp;
type ProjectionForGetAuthParts = Record< KeysToIncludeInAuthParts, 1 > & Record< WithObjIdProps, 0 >;
const projectionForGetAuthParts: ProjectionForGetAuthParts = {
  ...noMongoIdProjection,
  [ CoreNS.props.password ]: 1,
  [ CoreNS.props.id ]: 1,
  [ CoreNS.props.role ]: 1,
} as const;


export type Arg = {
  col: Collection< CoreNS.UserInDb >;
  query: adapterNS.getAuthParts.Arg;
};
export const _ = ( { query, col }: Arg ): Promise< adapterNS.getAuthParts.Resp > => (
  col.findOne(
    query,
    { projection: projectionForGetAuthParts },
  ) as Promise< Pick< CoreNS.UserInDb, KeysToIncludeInAuthParts > | null >
);
