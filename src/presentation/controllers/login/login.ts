import { badRequest } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body;

    if (!email) return badRequest(new Error('Missing param: email'));

    if (!password) return badRequest(new Error('Missing param: password'));

    return new Promise((resolve) => resolve({ statusCode: 200, body: {} }));
  }
}
