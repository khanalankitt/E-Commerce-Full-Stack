import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT ?? 4000),

  MONGODB_URI: getEnv("MONGODB_URI"),

  JWT_SECRET: getEnv("JWT_SECRET"),

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",

  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d",

  NODE_ENV: process.env.NODE_ENV ?? "development",
} as const;