import {
  Authentication,
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateDbAccessTokenRepository,
  AuthenticationModel,
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly hashComparer: HashComparer;
  private readonly encrypter: Encrypter;
  private readonly updateDbAccessTokenRepository: UpdateDbAccessTokenRepository;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateDbAccessTokenRepository: UpdateDbAccessTokenRepository,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.encrypter = encrypter;
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

    const account =
      await this.loadAccountByEmailRepository.loadByEmail(authEmail);
    if (!account) return null;

    const isValid = await this.hashComparer.compare(authPass, account.password);
    if (!isValid) return null;

    const accessToken = await this.encrypter.encrypt(account.id);
    if (!accessToken) return null;

    await this.updateDbAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken,
    );

    return accessToken;
  }
}
