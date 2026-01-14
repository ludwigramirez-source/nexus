import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';

dotenvConfig();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  DATABASE_URL: z.string(),
  
  // JWT
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
  
  // AI
  AI_PROVIDER: z.enum(['openai', 'claude']).default('claude'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4-turbo-preview'),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-sonnet-4-20250514'),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).default('587'),
  SMTP_SECURE: z.string().transform(val => val === 'true').default('false'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default('IPTEGRA Nexus <noreply@iptegra.com>'),
  ENABLE_EMAIL_NOTIFICATIONS: z.string().transform(val => val === 'true').default('true'),
  NOTIFICATION_ADMIN_EMAILS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;

export const config = {
  app: {
    env: env.NODE_ENV,
    port: env.PORT,
    isDev: env.NODE_ENV === 'development',
    isProd: env.NODE_ENV === 'production',
  },
  db: {
    url: env.DATABASE_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  cors: {
    origin: env.CORS_ORIGIN,
    allowedOrigins: env.ALLOWED_ORIGINS.split(','),
  },
  ai: {
    provider: env.AI_PROVIDER,
    openai: {
      apiKey: env.OPENAI_API_KEY,
      model: env.OPENAI_MODEL,
    },
    anthropic: {
      apiKey: env.ANTHROPIC_API_KEY,
      model: env.ANTHROPIC_MODEL,
    },
  },
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.EMAIL_FROM,
    enableNotifications: env.ENABLE_EMAIL_NOTIFICATIONS,
    adminEmails: env.NOTIFICATION_ADMIN_EMAILS?.split(',') || [],
  },
};
