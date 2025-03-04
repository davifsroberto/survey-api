export interface HashComparer {
  // eslint-disable-next-line no-unused-vars
  compare: (value: string, hash: string) => Promise<boolean>;
}
