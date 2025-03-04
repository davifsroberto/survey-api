import {
  Authentication,
  AuthenticationModel,
} from '../../../domain/usecases/authentication';
import { HashComparer } from '../../protocols/criptography/hash-compare';
import { TokenGenerator } from '../../protocols/criptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { AccountModel } from '../add-account/db-add-account-protocols';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly hashComparer: HashComparer;
  private readonly tokenGenerator: TokenGenerator;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const accountValidated = await this.validateAccount(authentication);

    if (!accountValidated) return null as unknown as string;

    return this.generateAccessToken(accountValidated.id);
  }

  private async validateAccount(
    authentication: AuthenticationModel,
  ): Promise<AccountModel | null> {
    const { email: authEmail, password: authPass } = authentication;

    const account = await this.loadAccountByEmailRepository.load(authEmail);
    if (!account) return null;

    const isValid = await this.hashComparer.compare(authPass, account.password);
    if (!isValid) return null;

    return account;
  }

  private async generateAccessToken(accountId: string): Promise<string> {
    return this.tokenGenerator.generate(accountId);
  }
}
