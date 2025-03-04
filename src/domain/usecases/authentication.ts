export interface AuthenticationModel {
  email: string;
  password: string;
}

export interface Authentication {
  auth(_authentication: AuthenticationModel): Promise<string>;
}
