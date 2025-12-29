import 'dotenv/config';
import z from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  EMAIL: z.string(),
  PASSWORD: z.string(),
  BASE_URL: z.string(),
  ORIGIN_REQUEST: z.string(),
});

export const env = envSchema.parse(process.env);
