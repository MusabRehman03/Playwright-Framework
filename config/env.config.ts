/**
 * Environment configuration
 * Centralized place for environment-specific settings
 */

export interface EnvironmentConfig {
  baseURL: string;
  apiURL: string;
  timeout: number;
  retries: number;
}

const environments: Record<string, EnvironmentConfig> = {
  development: {
    baseURL: 'http://localhost:3000',
    apiURL: 'http://localhost:3000/api',
    timeout: 30000,
    retries: 0,
  },
  staging: {
    baseURL: 'https://staging.example.com',
    apiURL: 'https://staging.example.com/api',
    timeout: 30000,
    retries: 1,
  },
  production: {
    baseURL: 'https://playwright.dev',
    apiURL: 'https://api.example.com',
    timeout: 30000,
    retries: 2,
  },
};

/**
 * Get environment configuration based on NODE_ENV
 * @returns Environment configuration object
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = process.env.NODE_ENV || 'production';
  return environments[env] || environments.production;
}

/**
 * Get base URL from environment or config
 * @returns Base URL string
 */
export function getBaseURL(): string {
  return process.env.BASE_URL || getEnvironmentConfig().baseURL;
}

/**
 * Get API URL from environment or config
 * @returns API URL string
 */
export function getAPIURL(): string {
  return process.env.API_URL || getEnvironmentConfig().apiURL;
}
