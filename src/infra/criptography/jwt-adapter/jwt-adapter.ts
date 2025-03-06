import jwt from 'jsonwebtoken';
import { Encrypter } from '../../../data/protocols/criptography/encrypter';

export class JwtAdapter implements Encrypter, Encrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secret);

    return token;
  }

  async decrypt(token: string): Promise<string> {
    const value = jwt.verify(token, this.secret);

    return String(value);
  }
}
