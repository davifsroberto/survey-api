import bcrypt from 'bcrypt';

import { Hasher } from '../../data/protocols/criptography/hasher';
import { HashComparer } from '../../data/protocols/criptography/hash-compare';

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  async hash(value: string): Promise<string> {
    const hash = bcrypt.hash(value, this.salt);

    return hash;
  }

  async compare(_value: string, _hash: string): Promise<boolean> {
    const isValid = bcrypt.compare(_value, _hash);

    return isValid;
  }
}
