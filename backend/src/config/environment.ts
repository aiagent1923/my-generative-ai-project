import dotenv from 'dotenv';

dotenv.config();

type EnvKey =
  | 'PORT'
  | 'DATABASE_URL'
  | 'JWT_SECRET'
  | 'NODE_ENV'
  | 'TWILIO_ACCOUNT_SID'
  | 'TWILIO_AUTH_TOKEN'
  | 'TWILIO_PHONE_NUMBER'
  | 'OPENAI_API_KEY'
  | 'ELEVENLABS_API_KEY'
  | 'DEEPGRAM_API_KEY';

const getEnv = (key: EnvKey, defaultValue?: string) => {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const toNumber = (value: string) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Expected numeric environment variable but received: ${value}`);
  }
  return parsed;
};

export const environment = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: toNumber(getEnv('PORT', '5000')),
  DATABASE_URL: getEnv('DATABASE_URL'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ?? '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ?? '',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ?? '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY ?? '',
  DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY ?? '',
};

export type Environment = typeof environment;
