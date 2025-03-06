export interface LogErrorRepository {
  logError(_stack: string): Promise<void>;
}
