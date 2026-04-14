type FrontendEnv = {
  VITE_API_BASE_URL: string;
  VITE_APP_TITLE: string;
};

function getRequiredEnv(name: "VITE_API_BASE_URL"): string {
  const value = import.meta.env[name];
  if (!value || typeof value !== "string") {
    throw new Error(`Missing required frontend environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnv(name: "VITE_APP_TITLE", fallback: string): string {
  const value = import.meta.env[name];
  if (!value || typeof value !== "string") {
    return fallback;
  }
  return value;
}

function assertValidUrl(rawUrl: string, name: string): string {
  try {
    const parsedUrl = new URL(rawUrl);
    if (!parsedUrl.protocol.startsWith("http")) {
      throw new Error("URL must start with http/https");
    }
    return parsedUrl.origin;
  } catch {
    throw new Error(
      `Invalid frontend environment variable ${name}: expected absolute URL, received "${rawUrl}"`,
    );
  }
}

export const env: FrontendEnv = {
  VITE_API_BASE_URL: assertValidUrl(
    getRequiredEnv("VITE_API_BASE_URL"),
    "VITE_API_BASE_URL",
  ),
  VITE_APP_TITLE: getOptionalEnv("VITE_APP_TITLE", "Velocity Deploy"),
};
