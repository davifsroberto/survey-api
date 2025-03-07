import { EmailInUseError } from '../../erros/email-in-use-error';
import {
  badRequest,
  forbiden,
  ok,
  serverError,
} from '../../helpers/http/http-helper';
import {
  AddAccount,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  Authentication,
} from './signup-controller-protocols';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) return badRequest(error);

      const { name, email, password } = httpRequest.body;
      const account = await this.addAccount.add({ name, email, password });

      if (!account) return forbiden(new EmailInUseError());

      const accessToken = await this.authentication.auth({ email, password });

      return ok({ accessToken });
    } catch (error) {
      console.error(error);

      return serverError(error);
    }
  }
}
