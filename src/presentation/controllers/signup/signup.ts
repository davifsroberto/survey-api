import { InvalidParamError, MissingParamError } from '../../erros';
import { badRequest, ok, serverError } from '../../helpers/http-helper';
import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from './signup-protocols';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      const reqBody = httpRequest.body;
      const { name, email, password, passwordConfirmation } = reqBody;

      for (const field of requiredFields) {
        if (!reqBody[field]) return badRequest(new MissingParamError(field));
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isEmailValid = this.emailValidator.isValid(email);

      if (!isEmailValid) return badRequest(new InvalidParamError('email'));

      const account = await this.addAccount.add({ name, email, password });

      return ok(account);
    } catch (error) {
      console.error(error);

      return serverError(error);
    }
  }
}
