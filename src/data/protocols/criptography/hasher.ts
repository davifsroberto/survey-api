export interface Hasher {
  // eslint-disable-next-line no-unused-vars
  hash(value: string): Promise<string>;
}
