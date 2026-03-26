import { DomainError } from '../error/DomainError.js';

describe('Domain Error Unit Tests', () => { 
  it('should return error instance of DomainError and have its profile properly', ()=>{
    const DE = new DomainError('Error random');

    expect(DE).toBeInstanceOf(DomainError);
    expect(DE.message).toEqual('Error random');
    expect(DE.statusCode).toEqual(400);
  });
});