import { DatabaseError } from 'pg';
import { DomainError } from './DomainError.js';

//error db mapper utk violated constraint (unique, dsb)
export function ErrorDBTranslator(err: unknown): Error {
  if (err instanceof DatabaseError){
    switch (err.code){
    case '22P02':
      return new DomainError('Invalid Data Format, for id make sure using uuid correctly', 422);
    case '23505':
      return new DomainError('Duplicate data, try again with valid args.', 409);
    case '23503':
      return new DomainError('Data doesn`t match with any relation');
    case '23502':
      return new DomainError('Invalid Request Value, Try again with valid args', 422);
    case '23514':
      return new DomainError('Invalid Request value does`nt meet requirements', 422);
    default:
      console.error('[DB_ERROR]:', err);
      return new DomainError('Internal Server Error', 500);
    }
  }
  if (err instanceof DomainError) return err;
  return err instanceof Error ? err : new Error('Unknown Error type');
}