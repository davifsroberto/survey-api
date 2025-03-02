import { MongoHelper as sut } from './mongo-helper';

describe('MongoHelpert', () => {
  beforeAll(async () => {
    await sut.connect(String(process.env.MONGO_URL));
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  it('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();

    accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();

    await sut.disconnect();
  });
});
