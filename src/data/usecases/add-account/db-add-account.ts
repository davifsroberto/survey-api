import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Hasher,
} from './db-add-account-protocols';

export class DbAddAccount {
  private readonly hasher: Hasher;
  private readonly addAccountRepository: AddAccountRepository;

  constructor(hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.hasher = hasher;
    this.addAccountRepository = addAccountRepository;
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password);
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword }),
    );

    return new Promise((resolve) => resolve(account));
  }
}
