import { DatabaseError } from 'pg';
import { DomainError } from './DomainError.js';

//error db mapper utk violated constraint (unique, dsb)
export function ErrorDBTranslator(err: unknown): Error {
  if (err instanceof DatabaseError){
    switch (err.code){
    case '23505':
      return new DomainError('Data Duplikat', 409);
    case '23503':
      return new DomainError('FK bermasalah');
    case '23502':
      return new DomainError('Not null violated', 422);
    case '23514':
      return new DomainError('conditional bermasalah', 422);
      default:
      return new DomainError(`Database Error: ${err.message}`, 500)
    }
  }
  if (err instanceof DomainError) return err;
  return err instanceof Error ? err : new Error('Unknown Error type');
}