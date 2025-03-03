import { InvalidParamError } from '../../erros';
import { badRequest, ok, serverError } from '../../helpers/http-helper';
import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  Validation,
} from './signup-protocols';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  private readonly validation: Validation;

  constructor(
    emailValidator: EmailValidator,
    addAccount: AddAccount,
    validation: Validation,
  ) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) return badRequest(error);

      const reqBody = httpRequest.body;
      const { name, email, password } = reqBody;

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
