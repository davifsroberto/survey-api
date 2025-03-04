import { AccountModel } from '../../../domain/models/account';
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

describe('DBAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      async load(email: string): Promise<AccountModel> {
        email;

        const fakeAccount = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
        };

        return new Promise((resolve) => resolve(fakeAccount));
      }
    }

    const loadAccountByEmailRepositoryStub =
      new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
