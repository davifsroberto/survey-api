import request from 'supertest';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';

import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';

let accountCollection: Collection;

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL));
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('POST /signup', () => {
    it('Should return 200 on signup', async () => {
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

  describe('POST /login', () => {
    it('Should return 200 on login', async () => {
      const password = await hash('12345', 12);

      await accountCollection.insertOne({
        name: 'Davi Roberto',
        email: 'davifsroberto@outlook.com',
        password,
      });

      await request(app)
        .post('/api/login')
        .send({
          email: 'davifsroberto@outlook.com',
          password: '12345',
        })
        .expect(200);
    });

    it('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'davifsroberto@outlook.com',
          password: '12345',
        })
        .expect(401);
    });
  });
});
