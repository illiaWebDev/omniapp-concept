import { getFull } from '@illia-web-dev/types/dist/types/ISO8601/UTC';
import type * as adapterNS from '@omniapp-concept/common/dist/services/User/adapter';


export const tags = {
  UserService: 'UserService',
  adapter: 'adapter',
  service: 'service',
} as const;
export const serviceTagsArr: string[] = [
  tags.UserService,
  tags.service,
];
export const adapterTagsArr: string[] = [
  tags.UserService,
  tags.adapter,
];


export const dummyAdapter: adapterNS.Adapter = {
  create: () => Promise.resolve( true ),
  get: () => Promise.resolve( null ),
  getAuthParts: () => Promise.resolve( null ),
  getList: () => Promise.resolve( [] ),
  patch: () => Promise.resolve( true ),
};

export const full = getFull();
