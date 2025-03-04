import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypt-adatper';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash_value'));
  },

  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  it('Should call hash with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('Should return a valid hash on hash success', async () => {
    const sut = makeSut();
    const hash = await sut.hash('any_value');

    expect(hash).toBe('hash_value');
  });

  it('Should throw if bcrypt throws', async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => Promise.reject(new Error()));
    const promise = sut.hash('any_value');

    await expect(promise).rejects.toThrow();
  });

  it('Shold call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');

    await sut.compare('any_value', 'any_hash');

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  it('Shold return true when compare succeeds', async () => {
    const sut = makeSut();
    const isValid = await sut.compare('any_value', 'any_hash');

    expect(isValid).toBe(true);
  });

  it('Shold return false when compare fails', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => false);
    const isValid = await sut.compare('any_value', 'any_hash');

    expect(isValid).toBe(false);
  });

  it('Shold throw if compare throws', async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementationOnce(() => Promise.reject(new Error()));
    const promise = sut.compare('any_value', 'any_hash');

    await expect(promise).rejects.toThrow();
  });
});
