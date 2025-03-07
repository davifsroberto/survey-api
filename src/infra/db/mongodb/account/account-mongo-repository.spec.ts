import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL));
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.deleteMany({});
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  it('Should return an account on add success', async () => {
    const sut = makeSut();

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@domain.com',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@domain.com');
    expect(account.password).toBe('any_password');
  });

  it('Should return an account on loadByEmail success', async () => {
    const sut = makeSut();

    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@domain.com',
      password: 'any_password',
    });

    const account = await sut.loadByEmail('any_email@domain.com');

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@domain.com');
    expect(account.password).toBe('any_password');
  });

  it('Should return null if loadByEmail fails', async () => {
    const sut = makeSut();
    const account = await sut.loadByEmail('any_email@domain.com');

    expect(account).toBeFalsy();
  });

  /*
  TODO: Fix this test

  it('Shold update the account accessToken on updateAccessToken success ', async () => {
    const sut = makeSut();
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@domain.com',
      password: 'any_password',
    });
    const fakeAccount = res;

    console.log(fakeAccount);

    expect(res.ops[0].accessToken).toBeFalsy();

    await sut.updateAccessToken(res.ops[0]._id, 'any_token');

    const account = await accountCollection.findOne({ _id: res.ops[0]._id });

    expect(account).toBeTruthy();
    expect(account.accessToken).toBe('any_token');
  });
  */
});
