export interface Validation {
  validate<T>(_input: T): Error;
}
