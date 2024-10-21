import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.string(),
  SERVICE_NAME: z.string(),

  JWT_SECRET: z.string(),
  JWT_ACCESS_TOKEN_TTL: z.string(),
  JWT_REFRESH_TOKEN_TTL: z.string(),

  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_MIGRATIONS_RUN: z.coerce.boolean(),
  POSTGRES_IF_NOT_EXISTS: z.coerce.boolean(),

  AUTOVALIDATE_EMAIL: z.coerce.boolean(),
});
export type Env = z.infer<typeof envSchema>;
