/**
 * Simple logger utility for test execution
 */
export class Logger {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  static info(message: string): void {
    // eslint-disable-next-line no-console
    console.log(this.formatMessage('INFO', message));
  }

  static error(message: string, error?: Error): void {
    // eslint-disable-next-line no-console
    console.error(this.formatMessage('ERROR', message));
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  static warn(message: string): void {
    // eslint-disable-next-line no-console
    console.warn(this.formatMessage('WARN', message));
  }

  static debug(message: string): void {
    if (process.env.DEBUG) {
      // eslint-disable-next-line no-console
      console.debug(this.formatMessage('DEBUG', message));
    }
  }

  static step(stepNumber: number, description: string): void {
    // eslint-disable-next-line no-console
    console.log(this.formatMessage('STEP', `${stepNumber}. ${description}`));
  }
}
