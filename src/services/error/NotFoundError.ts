import { DomainError } from './DomainError.js';

export class NotFoundError extends DomainError{
  public statusCode: number;
  constructor(message: string, statusCode: number = 404){
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.name = 'NotFoundError';

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}