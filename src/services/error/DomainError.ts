export class DomainError extends Error{
  constructor(public message: string, public statusCode: number=400){
    super(message);
    this.name = 'DomainError';
  }
}
// default error code 400