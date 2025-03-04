export interface AuthenticationModel {
  email: string;
  password: string;
}

export interface Authentication {
  // eslint-disable-next-line no-unused-vars
  auth(authentication: AuthenticationModel): Promise<string>;
}
