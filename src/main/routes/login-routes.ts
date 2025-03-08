import { Router } from 'express';

import { makeSignUpController } from '../factories/controllers/signup/signup-controller-factory';
import { adaptRoute } from '../adapters/express/express-routes-adapter';
import { makeLoginController } from '../factories/controllers/login/login-controller-factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/login', adaptRoute(makeLoginController()));
};
