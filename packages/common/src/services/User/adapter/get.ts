import type * as coreNS from '../core';

/**
 * - used when we initiate createDefaultOnApiStartup and \
 * need to check if such user already exists
 * - in getMe (to respond with jwt and userOutOfDb in one go)
 * - in login (same logic as above)
 */
export type Arg = Partial< Pick< coreNS.UserOutOfDb, 'id' | 'username' | 'status' > >;
export type Resp = coreNS.UserOutOfDb | null;
