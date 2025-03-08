import env from '../../../config/env';
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication';
import { BcryptAdapter } from '../../../../infra/criptography/bcrypter-adapter/bcrypt-adatper';
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository';
import { Authentication } from '../../../../domain/usecases/authentication';

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();

  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );
};
