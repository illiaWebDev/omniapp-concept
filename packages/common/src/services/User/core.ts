import type { RecordValues } from '@illia-web-dev/types/dist/types/RecordValues';
import type { BcryptPassword } from '@illia-web-dev/types/dist/types/BcryptPassword';
import type { SafeOmit } from '@illia-web-dev/types/dist/types/Omit';
import type { JSONSchemaType } from 'ajv';
import type { PropertiesSchema } from 'ajv/dist/types/json-schema';
import { WithHistory, WithObjId } from '../_common';
import type { UserId } from '../../helpers/UserUtils';

// ===================================================================================

export const CollectionName = 'users' as const;
export const usernameForDefaultUser = 'admin@test.com';

export const UserStatus = {
  registrationRequest: 'registrationRequest',
  registered: 'registered',
} as const;


export const UserRole = {
  admin: 'admin',
  powerUser: 'powerUser',
  user: 'user',
} as const;
export type UserRoleT = RecordValues< typeof UserRole >;
export type WithRole = { role: UserRoleT[] };

export const matchesAllowedRole = ( allowedRoles: UserRoleT[], roles: UserRoleT[] ): boolean => (
  roles.some( role => allowedRoles.indexOf( role ) !== -1 )
);

/** number of rounds for password hashing */
export const SALT_ROUNDS = 12;


export const props = {
  ...WithHistory.props,
  id: 'id',
  username: 'username',
  password: 'password',
  role: 'role',
  status: 'status',
} as const;

export type UserInDb = WithHistory.WithHistoryT & {
  [ props.id ]: UserId;
  [ props.username ]: string;
  [ props.password ]: BcryptPassword;
  [ props.role ]: WithRole[ 'role' ];
  [ props.status ]: keyof typeof UserStatus;
};
// ===================================================================================

export const properties: PropertiesSchema< UserInDb > = {
  ...WithHistory.properties,
  ...WithObjId.properties,
  id: { type: 'string' },
  username: { type: 'string' },
  password: { type: 'string' },
  role: {
    type: 'array',
    items: { type: 'string', enum: Object.values( UserRole ) },
  },
  status: {
    type: 'string',
    enum: Object.values( UserStatus ),
  },
};
export const required: Array< keyof typeof props > = (
  ( [] as Array< keyof typeof props > )
    .concat( [ props.id, props.username, props.password, props.role, props.status ] )
    .concat( WithHistory.required )
);

export const schema: JSONSchemaType< UserInDb > = {
  type: 'object',
  additionalProperties: false,
  properties,
  required,
};


export const dbOnlyFields = {
  [ props.password ]: true,
} as const;
export type UserDbOnlyFields = keyof typeof dbOnlyFields;
export type UserOutOfDb = SafeOmit< UserInDb, UserDbOnlyFields >;
