import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);

    const { statusCode, body } = httpResponse;
    const isServerError = statusCode >= 500 && statusCode <= 599;

    if (isServerError) await this.logErrorRepository.logError(body.stack);

    return httpResponse;
  }
}
