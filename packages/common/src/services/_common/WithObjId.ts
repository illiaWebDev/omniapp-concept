import type { JSONSchemaType, PropertiesSchema } from 'ajv/dist/types/json-schema';


export const props = {
  _id: '_id',
} as const;
export type Props = keyof typeof props;


export type WithObjIdT = {
  // don't want to use ObjectId from mongodb types,
  // this should be good enough
  [ props._id ]: Record< string, unknown >;
};

export const properties: PropertiesSchema< WithObjIdT > = {
  // we only need this field so that mongo doesn't complain about
  // _id field, but we need no validation, so migt as well cast
  // to any to avoid any type issues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [ props._id ]: {} as any,
};
export const required = [ props._id ];

export const schema: JSONSchemaType< WithObjIdT > = {
  type: 'object',
  properties,
  required,
  additionalProperties: false,
};
