import { badRequest } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signup-protocols';
import { MissingParamError } from '../../erros';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest;
    const { email } = body;
    const requiredFields = ['email', 'password'];

    for (const field of requiredFields) {
      if (!body[field]) {
        return new Promise((resolve) => {
          resolve(badRequest(new MissingParamError(field)));
        });
      }
    }

    const isValidEmail = this.emailValidator.isValid(email);

    if (!isValidEmail) {
      return new Promise((resolve) =>
        resolve(badRequest(new Error('Invalid param: email'))),
      );
    }

    return new Promise((resolve) => resolve({ statusCode: 200, body: {} }));
  }
}
