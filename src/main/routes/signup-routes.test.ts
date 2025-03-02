import request from 'supertest';

import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';

describe('Signup Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL));
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Davi Roberto',
        email: 'davifsroberto@outlook.com',
        password: '12345',
        passwordConfirmation: '12345',
      })
      .expect(200);
  });
});
