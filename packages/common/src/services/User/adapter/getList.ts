import type * as coreNS from '../core';

/**
 * - used when we want to get list of users for admin\
 * we want to get both registered and registrationRequests\
 * as admin could decide to approve
 */
export type Resp = coreNS.UserOutOfDb[];
