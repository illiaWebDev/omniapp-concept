import { customAlphabet } from 'nanoid';

/**
 * default length: 10;\
 * alphabet: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
 */
export const nanoid = customAlphabet( '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_', 10 );
export type NanoIdTConst = 'nanoId';
