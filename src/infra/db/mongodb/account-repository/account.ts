import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AccountModelInserted, MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
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
}
