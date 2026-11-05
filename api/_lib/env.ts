import { z } from 'zod'

// Validated once per cold start, on first use rather than at import, so a missing variable fails the
// request with a clear log line instead of crashing the build or an unrelated function
const EnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  IP_SALT: z.string().min(16, 'IP_SALT must be at least 16 characters'),
  // Comma-separated; deployment URLs (previews included) are allowed automatically via VERCEL_URL
  ALLOWED_ORIGINS: z.string().default('https://iamibm.me,https://www.iamibm.me'),
  DAILY_BUDGET_USD: z.coerce.number().nonnegative().default(1),
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
})

export type Env = z.infer<typeof EnvSchema>

let cached: Env | null = null

export function getEnv(): Env {
  if (cached) return cached
  const parsed = EnvSchema.safeParse(process.env)
  if (!parsed.success) {
    const fields = parsed.error.issues.map(issue => issue.path.join('.')).join(', ')
    throw new Error(`Invalid or missing environment variables: ${fields}`)
  }
  cached = parsed.data
  return cached
}
