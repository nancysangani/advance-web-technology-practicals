import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_URL: z
    .string()
    .transform((raw) =>
      raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    )
    .refine((origins) => origins.length > 0, {
      message: "At least one frontend origin must be provided",
    })
    .refine((origins) => origins.every(isValidHttpUrl), {
      message:
        "Each frontend origin must be a valid absolute URL (http/https). Use comma-separated URLs for multiple origins.",
    }),
  API_KEY: z.string().min(8),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid backend env:", parsed.error.flatten().fieldErrors);
  throw new Error("Backend environment variables are invalid");
}

export const env = parsed.data;
