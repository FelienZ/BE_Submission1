export class DomainError extends Error{
  public statusCode: number;
  constructor(message: string, statusCode = 400){
    super(message);
    this.statusCode = statusCode;
    this.name = 'DomainError';
    
    // penting set prototype agar tahu ini instance spesifik bukan parentnya
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}
// default error code 400