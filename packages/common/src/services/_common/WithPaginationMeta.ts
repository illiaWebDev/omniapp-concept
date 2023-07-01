import type { Natural } from '@illia-web-dev/types/dist/types/Natural';


export type WithPaginationMetaT<U> = {
  data: U[];
  total: Natural;
  limit: -1 | Natural;
  skip: Natural;
};
