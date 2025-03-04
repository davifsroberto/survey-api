export interface TokenGenerator {
  // eslint-disable-next-line no-unused-vars
  generate: (id: string) => Promise<string>;
}
