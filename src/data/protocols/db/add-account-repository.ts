import { AccountModel } from '../../../domain/models/account';
import { AddAccountModel } from '../../usecases/add-account/db-add-account-protocols';

export interface AddAccountRepository {
  // eslint-disable-next-line no-unused-vars
  add(accountData: AddAccountModel): Promise<AccountModel>;
}
