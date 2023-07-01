import type { ISO8601 } from '@illia-web-dev/types/dist/types';
import type { JSONSchemaType } from 'ajv';
import type { PropertiesSchema } from 'ajv/dist/types/json-schema';
import type { UserId } from '../../helpers/UserUtils';


export const props = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy',
} as const;
export const SYSTEM = 'system';
export type Props = keyof typeof props;


export type WithHistoryT = {
  [ props.createdAt ]: ISO8601.UTC.Full;
  [ props.updatedAt ]: ISO8601.UTC.Full;
  [ props.createdBy ]: UserId | typeof SYSTEM;
  [ props.updatedBy ]: UserId | typeof SYSTEM;
};
export type HistoryProps = keyof WithHistoryT;
export const defaultT: WithHistoryT = {
  createdAt: '1970-01-01T00:00:00.000Z' as ISO8601.UTC.Full,
  updatedAt: '1970-01-01T00:00:00.000Z' as ISO8601.UTC.Full,
  createdBy: SYSTEM,
  updatedBy: SYSTEM,
};

export const properties: PropertiesSchema< WithHistoryT > = {
  [ props.createdAt ]: { type: 'string' },
  [ props.updatedAt ]: { type: 'string' },
  [ props.createdBy ]: { type: 'string' },
  [ props.updatedBy ]: { type: 'string' },
};
export const required = [ props.createdAt, props.createdBy, props.updatedAt, props.updatedBy ];

export const schema: JSONSchemaType< WithHistoryT > = {
  type: 'object',
  properties,
  required,
  additionalProperties: false,
};
