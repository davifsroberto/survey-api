export interface Validation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(_input: any): Error;
}
