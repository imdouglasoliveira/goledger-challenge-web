import 'dotenv/config';

interface EnvConfig {
  GOLEDGER_BASE_URL: string;
  GOLEDGER_USERNAME: string;
  GOLEDGER_PASSWORD: string;
  NODE_ENV: string;
  PORT: number;
}

function loadEnv(): EnvConfig {
  const required: (keyof EnvConfig)[] = [
    'GOLEDGER_BASE_URL',
    'GOLEDGER_USERNAME',
    'GOLEDGER_PASSWORD',
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    GOLEDGER_BASE_URL: process.env.GOLEDGER_BASE_URL!,
    GOLEDGER_USERNAME: process.env.GOLEDGER_USERNAME!,
    GOLEDGER_PASSWORD: process.env.GOLEDGER_PASSWORD!,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),
  };
}

export const env = loadEnv();
