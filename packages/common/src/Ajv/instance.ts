import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import addFormats from 'ajv-formats';

export const instance = new Ajv( { allErrors: true } );
ajvErrors( instance );
addFormats( instance );
