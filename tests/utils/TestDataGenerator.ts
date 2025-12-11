/**
 * Test Data Generator utility
 * Provides methods to generate random test data
 */
export class TestDataGenerator {
  /**
   * Generate random email
   * @param prefix - Optional prefix for email
   * @returns Random email address
   */
  static generateEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}.${timestamp}.${random}@example.com`;
  }

  /**
   * Generate random string
   * @param length - Length of the string
   * @returns Random string
   */
  static generateRandomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate random number in range
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Random number
   */
  static generateRandomNumber(min: number = 0, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random username
   * @returns Random username
   */
  static generateUsername(): string {
    return `user_${this.generateRandomString(8)}`;
  }

  /**
   * Generate random password
   * @param length - Length of password
   * @returns Random password with mixed characters
   */
  static generatePassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const all = uppercase + lowercase + numbers + special;

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = 4; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  /**
   * Generate random phone number
   * @returns Random phone number in format (XXX) XXX-XXXX
   */
  static generatePhoneNumber(): string {
    const areaCode = this.generateRandomNumber(200, 999);
    const prefix = this.generateRandomNumber(200, 999);
    const lineNumber = this.generateRandomNumber(1000, 9999);
    return `(${areaCode}) ${prefix}-${lineNumber}`;
  }
}
