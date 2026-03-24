import { DomainError } from './DomainError.js';

//error db mapper utk violated constraint (unique, dsb)
export function ErrorDBTranslator(err: any): Error {
  //bermasalah cek instance DatabaseError (di wrap new error repo ke cause)
  if (err && typeof err == 'object' && err.cause){
    switch (err.cause?.code){
    case '23505':
      return new DomainError('Data Duplikat', 409);
    case '23503':
      return new DomainError('FK bermasalah');
    case '23502':
      return new DomainError('Not null violated', 422);
    case '23514':
      return new DomainError('conditional bermasalah', 422);
    } 
  }
  if (err instanceof DomainError) return err;
  return err instanceof Error ? err : new Error('Unknown Error type');
}