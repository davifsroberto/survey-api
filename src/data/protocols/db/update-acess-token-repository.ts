export interface UpdateDbAccessTokenRepository {
  // eslint-disable-next-line no-unused-vars
  update(id: string, token: string): Promise<void>;
}
