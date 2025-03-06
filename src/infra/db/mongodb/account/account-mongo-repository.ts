import { ObjectId } from 'mongodb';

import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { UpdateDbAccessTokenRepository } from '../../../../data/protocols/db/account/update-acess-token-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AccountModelInserted, MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateDbAccessTokenRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const insertedUserCursor = await accountCollection.find({
      _id: result.insertedId,
    });
    const insertedUser = await insertedUserCursor.toArray();
    const account = insertedUser[0] as AccountModelInserted;

    return MongoHelper.map<AccountModelInserted, AccountModel>(account);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });

    if (!account) return null as unknown as AccountModel;

    const accountMaped: AccountModel = await MongoHelper.map(account);

    return account && accountMaped;
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const _id = id as unknown as ObjectId;

    await accountCollection.updateOne(
      { _id },
      { $set: { accessToken: token } },
    );
  }
}
