import {
  Authentication,
  AuthenticationModel,
} from '../../../domain/usecases/authentication';
import { HashComparer } from '../../protocols/criptography/hash-compare';
import { TokenGenerator } from '../../protocols/criptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { UpdateDbAccessTokenRepository } from '../../protocols/db/update-acess-token-repository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly hashComparer: HashComparer;
  private readonly tokenGenerator: TokenGenerator;
  private readonly updateDbAccessTokenRepository: UpdateDbAccessTokenRepository;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateDbAccessTokenRepository: UpdateDbAccessTokenRepository,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
    this.updateDbAccessTokenRepository = updateDbAccessTokenRepository;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const accessToken = await this.validateAccount(authentication);

    if (!accessToken) return null as unknown as string;

    return accessToken;
  }

  private async validateAccount(
    authentication: AuthenticationModel,
  ): Promise<string | null> {
    const { email: authEmail, password: authPass } = authentication;

    const account = await this.loadAccountByEmailRepository.load(authEmail);
    if (!account) return null;

    const isValid = await this.hashComparer.compare(authPass, account.password);
    if (!isValid) return null;

    const accessToken = await this.tokenGenerator.generate(account.id);
    if (!accessToken) return null;

    await this.updateDbAccessTokenRepository.update(account.id, accessToken);

    return accessToken;
  }
}
