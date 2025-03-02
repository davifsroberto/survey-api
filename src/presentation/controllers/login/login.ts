import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http-helper';
import { MissingParamError } from '../../erros';
import {
  Authentication,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from './login-protocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly authentication: Authentication;

  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;
      const { email, password } = body;
      const requiredFields = ['email', 'password'];

      for (const field of requiredFields) {
        if (!body[field]) return badRequest(new MissingParamError(field));
      }

      const isValidEmail = this.emailValidator.isValid(email);

      if (!isValidEmail) return badRequest(new Error('Invalid param: email'));

      const accessToken = await this.authentication.auth(email, password);

      if (!accessToken) return unauthorized();

      return ok({ accessToken });
    } catch (error) {
      console.error(error);

      return serverError(error);
    }
  }
}
