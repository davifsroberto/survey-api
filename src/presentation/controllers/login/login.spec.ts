import { InvalidParamError } from '../../erros';
import { badRequest } from '../../helpers/http-helper';
import { LoginController } from './login';
import { Authentication, EmailValidator, HttpRequest } from './login-protocols';

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

const EmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      email;

      return true;
    }
  }

  return new EmailValidatorStub();
};

const Authentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      email;
      password;

      return 'any_token';
    }
  }

  return new AuthenticationStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = EmailValidator();
  const authenticationStub = Authentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);

  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  };
};

describe('Login Controller', () => {
  it('Shold return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new Error('Missing param: email')));
  });

  it('Shold return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      badRequest(new Error('Missing param: password')),
    );
  });

  it('Shold return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('Shold call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(makeFakeRequest());

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('Shold call authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    await sut.handle(makeFakeRequest());

    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password');
  });

  /*
  TODO: Fix this test
  it('Shold return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });
  */
});
