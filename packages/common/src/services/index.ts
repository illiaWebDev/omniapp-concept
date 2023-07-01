import type * as UserNS from './User';


export type WithServices = (
  & UserNS.service.WithService
);
export type GetServices = () => WithServices;


export * as User from './User';
