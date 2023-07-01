import type * as createNS from '../adapter/create';

/**
 * returns true if created default admin\
 * and false if they already existed in db OR\
 * if we dont have corresponding env variable \
 * with default user password set
 */
export type Resp = createNS.Resp;
