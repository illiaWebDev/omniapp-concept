import type { ValidateFunction } from 'ajv';


export const errorMessageProp = 'errorMessage';

/**
 * @example
 * {
 *    name: [
 *      'this field is required',
 *      'minimum length should be 6 characters'
 *    ],
 *    password: ['must include at least one number'],
 *    'contacts.address': ['this field is required']
 * }
 */
export type AggregatedErrorTexts = { [ dottedPath: string ]: string[] };
export const aggregate = ( errors: ValidateFunction[ 'errors' ] ): AggregatedErrorTexts => {
  if ( errors === undefined || errors === null ) return {};

  return errors.reduce< AggregatedErrorTexts >(
    ( a, err ) => {
      if ( err.instancePath === '' ) return a;

      const path = err.instancePath.split( '/' ).filter( Boolean ).join( '.' );
      // eslint-disable-next-line no-param-reassign
      if ( err.message ) a[ path ] = ( a[ path ] || [] ).concat( err.message );

      return a;
    },
    {},
  );
};

// ===================================================================================

export const msgsHash = {
  nonEmptyString: {
    _: 'Should be non empty string',
    uk: 'Це поле має бути заповнене',
  },
};

export const common = {
  /**
   * is used to augment standard "required" in Json-schema\
   * which just means "present" (so for strings - empty\
   * would do just fine), but we want a little bit more \
   * than empty string, so that's how "starts with non-space\
   * char" appeared
   */
  nonEmptyString: {
    pattern: String.raw`^\S`,
    [ errorMessageProp ]: { pattern: msgsHash.nonEmptyString.uk },
  },
};
