import { AccountModel } from '../usecases/add-account/db-add-account-protocols';

export interface LoadAccountByEmailRepository {
  // eslint-disable-next-line no-unused-vars
  load(email: string): Promise<AccountModel>;
}
