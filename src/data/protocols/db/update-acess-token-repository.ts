export interface UpdateDbAccessTokenRepository {
  updateAccessToken(_id: string, token: string): Promise<void>;
}
