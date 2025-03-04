import {
  Authentication,
  AuthenticationModel,
} from '../../../domain/usecases/authentication';
import { HashComparer } from '../../protocols/criptography/hash-compare';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly hashComparer: HashComparer;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication;

    const account = await this.loadAccountByEmailRepository.load(email);

    account && (await this.hashComparer.compare(password, account.password));

    return null as unknown as string;
  }
}
