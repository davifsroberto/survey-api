export interface HashComparer {
  compare: (_value: string, _hash: string) => Promise<boolean>;
}
