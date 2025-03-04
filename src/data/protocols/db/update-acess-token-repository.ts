export interface UpdateDbAccessTokenRepository {
  update(_id: string, token: string): Promise<void>;
}
