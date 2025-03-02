export interface Authentication {
  // eslint-disable-next-line no-unused-vars
  auth(email: string, password: string): Promise<string>;
}
