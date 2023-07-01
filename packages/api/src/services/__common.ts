import type { Props as WithObjIdProps } from '@omniapp-concept/common/dist/services/_common/WithObjId';
import type { UserId } from '@omniapp-concept/common/dist/helpers/UserUtils';
import { WithHistoryT, SYSTEM } from '@omniapp-concept/common/dist/services/_common/WithHistory';
import * as ISO8601 from '@illia-web-dev/types/dist/types/ISO8601';


export function addWithHistory< U extends Record< string, unknown > >(
  e: U,
  createdUpdatedBy: UserId | null,
): WithHistoryT & U {
  const now = ISO8601.UTC.getFull();

  return {
    ...e,
    createdAt: now,
    updatedAt: now,
    createdBy: createdUpdatedBy || SYSTEM,
    updatedBy: createdUpdatedBy || SYSTEM,
  };
}

/* eslint-disable function-paren-newline */
export function updateWithHistory< U extends Record< string, unknown > >(
  e: U, userId: UserId | null,
): Pick< WithHistoryT, 'updatedAt' | 'updatedBy' > & U {
/* eslint-enable function-paren-newline */
  const now = ISO8601.UTC.getFull();

  return {
    ...e,
    updatedAt: now,
    updatedBy: userId || SYSTEM,
  };
}


export const noMongoIdProjection: Record< WithObjIdProps, 0 > = {
  _id: 0,
};
