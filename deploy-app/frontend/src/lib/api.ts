import { env } from "../config/env";

export type HealthResponse = {
  ok: boolean;
  message: string;
  now: string;
};

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${env.VITE_API_BASE_URL}/api/health`);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json() as Promise<HealthResponse>;
}
