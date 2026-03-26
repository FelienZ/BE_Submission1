import { DatabaseError } from 'pg';
import { ErrorDBTranslator } from '../error/ErrorTranslator.js';
import { DomainError } from '../error/DomainError.js';

describe('ErrorDBTranslator Unit Test', ()=> {
  it('Should return Duplicate Domain Error correctly', ()=>{
    const DBE = new DatabaseError('Unique Violated', 1, 'error');
    DBE.code = '23505';
    const translated = ErrorDBTranslator(DBE);

    expect(translated).toBeInstanceOf(DomainError);
    expect(translated.message).toEqual('Data Duplikat');
  });
  it('Should return error 500 if code of error DB not defined in mapper', ()=>{
    const DBE = new DatabaseError('Table not found', 1, 'error');
    DBE.code = '42P01';
    const translated = ErrorDBTranslator(DBE);

    expect(translated).toBeInstanceOf(DomainError);
    expect((translated as DomainError).statusCode).toEqual(500);
  });
});