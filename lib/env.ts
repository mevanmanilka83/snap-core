const requiredEnvVars = [
  'NEXT_PUBLIC_APP_URL',
] as const;

const optionalEnvVars = [
  'NEXT_PUBLIC_ANALYTICS_ID',
] as const;

type RequiredEnvVar = typeof requiredEnvVars[number];
type OptionalEnvVar = typeof optionalEnvVars[number];

type EnvVar = RequiredEnvVar | OptionalEnvVar;

function validateEnv() {
  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

// Validate environment variables in production
if (process.env.NODE_ENV === 'production') {
  validateEnv();
}

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL as string,
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
} as const;

export type Env = typeof env; 