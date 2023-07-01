import type { Resolver, ResolverError } from 'react-hook-form';
import type { ValidateFunction } from 'ajv';
import * as AjvNS from '@omniapp-concept/common/dist/Ajv';
import { ObjKeys } from '@illia-web-dev/types/dist/types';


export function createRhfResolver< T extends Record< string, unknown > >(
  validate: ValidateFunction< T >,
): Resolver< T > {
  return values => {
    const isValid = validate( values );
    if ( isValid ) {
      return {
        values,
        errors: {},
      };
    }

    const aggregatedErrs = AjvNS.errors.aggregate( validate.errors );

    return {
      values: {},
      errors: ObjKeys( aggregatedErrs ).reduce< ResolverError< T >[ 'errors' ] >( ( a, key ) => ( {
        ...a,
        [ String( key ) as keyof typeof values ]: {
          type: 'validation',
          message: aggregatedErrs[ key ]?.[ 0 ],
        },
      } ), {} ),
    };
  };
}
