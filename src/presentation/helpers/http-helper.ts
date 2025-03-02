import { HttpResponse } from '../protocols/http';
import { ServerError } from '../erros/server-error';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const serverError = (error?: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error?.stack),
});

export const ok = <T>(data: T): HttpResponse => ({
  statusCode: 200,
  body: data,
});
