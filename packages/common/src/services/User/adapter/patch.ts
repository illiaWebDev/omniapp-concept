import type * as coreNS from '../core';

/**
 * - used when we approve regReqeust
 */
export type Arg = {
  id: coreNS.UserOutOfDb[ 'id' ];
  data: Pick< coreNS.UserInDb, 'status' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' >;
};
export type Resp = true;
