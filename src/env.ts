import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().min(1).url(),
  VITE_ENABLE_API_DELAY: z.coerce.boolean(),
})

export const env = envSchema.parse(import.meta.env)
