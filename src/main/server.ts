import app from './config/app';
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper';
import env from './config/env';

MongoHelper.connect(env.mongoUrl).then(async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  (await import('./config/app')).default;

  app.listen(env.port, () => {
    console.log(`Server is running at http://localhost:${env.port}`);
  });
});
