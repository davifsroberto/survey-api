import validator from 'validator';

import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSuit = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSuit();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValid = sut.isValid('invalid_email@mail.com');

    expect(isValid).toBe(false);
  });

  it('Should return true if validator returns false', () => {
    const sut = makeSuit();
    const isValid = sut.isValid('valid_email@mail.com');

    expect(isValid).toBe(true);
  });

  it('Should call validator with correct email', () => {
    const sut = makeSuit();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');

    sut.isValid('any_email@mail.com');

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
