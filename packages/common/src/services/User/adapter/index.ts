import type * as get from './get';
import type * as create from './create';
import type * as getAuthParts from './getAuthParts';
import type * as getList from './getList';
import type * as patch from './patch';


export type Adapter = {
  get( arg: get.Arg ): Promise< get.Resp >;
  create( arg: create.Arg ): Promise< create.Resp >;
  getAuthParts( arg: getAuthParts.Arg ): Promise< getAuthParts.Resp >;
  getList(): Promise< getList.Resp >;
  patch( arg: patch.Arg ): Promise< patch.Resp >;
};


export * as create from './create';
export * as get from './get';
export * as getAuthParts from './getAuthParts';
export * as getList from './getList';
export * as patch from './patch';
