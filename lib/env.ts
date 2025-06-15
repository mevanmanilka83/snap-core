const requiredEnvVars = [
  'NEXT_PUBLIC_APP_URL',
] as const;

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
} as const;

export type Env = typeof env; 