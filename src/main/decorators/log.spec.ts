import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { AccountModel } from '../../domain/models/account';
import { ok, serverError } from '../../presentation/helpers/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface SuitTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      httpRequest;

      return new Promise((resolve) => resolve(ok(makeFakeAccount())));
    }
  }
  return new ControllerStub();
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      stack;

      return new Promise((resolve) => resolve());
    }
  }
  return new LogErrorRepositoryStub();
};

const makeSuit = (): SuitTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@domain.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@domain.com',
  password: 'valid_password',
});

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSuit();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    await sut.handle(makeFakeRequest());

    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSuit();

    await sut.handle(makeFakeRequest());

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSuit();

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeServerError())),
      );

    await sut.handle(makeFakeRequest());

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
