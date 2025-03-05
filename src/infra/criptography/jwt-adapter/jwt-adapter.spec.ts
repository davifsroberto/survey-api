import jwt from 'jsonwebtoken';

import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve('any_token'));
  },
}));

describe('JWT Adapter', () => {
  it('Should call a sing with correct values', async () => {
    const sut = new JwtAdapter('secret');
    const signSpy = jest.spyOn(jwt, 'sign');

    await sut.encrypt('any_id');

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });

  it('Should return a token on sign success', async () => {
    const sut = new JwtAdapter('secret');
    const accessToken = await sut.encrypt('any_id');

    expect(accessToken).toBe('any_token');
  });

  it('Should throw if sign throws', async () => {
    const sut = new JwtAdapter('secret');

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(sut.encrypt('any_id')).rejects.toThrow();

    expect(jwt.sign).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });

  it('Shold throw if verify throws', async () => {
    const sut = new JwtAdapter('secret');

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.decrypt('any_id');

    await expect(promise).rejects.toThrow();
  });
});
