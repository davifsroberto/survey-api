export class ServerError extends Error {
  constructor(stack?: string) {
    super('Interno server error');

    this.name = 'ServerError';
    this.stack = stack;
  }
}
