export interface Hasher {
  hash(_value: string): Promise<string>;
}
