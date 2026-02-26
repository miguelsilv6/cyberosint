import { z } from 'zod';

// Validação centralizada das variáveis de ambiente.
// Falha no arranque se faltar configuração essencial.
export const envSchema = z.object({
  APP_ENV: z.string(),
  API_PORT: z.coerce.number(),
  API_CORS_ORIGINS: z.string(),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string(),
  PASSWORD_SALT_ROUNDS: z.coerce.number(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_REGION: z.string(),
  S3_BUCKET_EVIDENCE: z.string(),
  MINIO_ENDPOINT: z.string(),
  MINIO_PORT: z.coerce.number(),
  S3_USE_SSL: z.string(),
  INGEST_FETCH_TIMEOUT_MS: z.coerce.number(),
  INGEST_MAX_REDIRECTS: z.coerce.number(),
  INGEST_ALLOWED_PROTOCOLS: z.string(),
  APP_VERSION: z.string(),
  SEED_ADMIN_EMAIL: z.string().email(),
  SEED_ADMIN_PASSWORD: z.string(),
  SEED_ADMIN_ROLE: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>) {
  // Faz parse e devolve um erro legível para troubleshooting rápido.
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(
      `Invalid environment variables:\n${JSON.stringify(result.error.format(), null, 2)}`,
    );
  }
  return result.data;
}
