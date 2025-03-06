import env from '../../config/env';
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { BcryptAdapter } from '../../../infra/criptography/bcrypter-adapter/bcrypt-adatper';
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeLoginValidation } from './login-validation-factory';

export const makeLoginController = (): Controller => {
  const salt = 12;
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );
  const loginController = new LoginController(
    makeLoginValidation(),
    dbAuthentication,
  );
  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(loginController, logMongoRepository);
};
