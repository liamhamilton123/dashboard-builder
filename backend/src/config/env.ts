import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  anthropicApiKey: string;
  workspaceBasePath: string;
}

function validateEnv(): EnvironmentConfig {
  const requiredEnvVars = ['ANTHROPIC_API_KEY'];

  const missing = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file.'
    );
  }

  return {
    port: parseInt(process.env.PORT || '2000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:2500',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
    workspaceBasePath: process.env.WORKSPACE_BASE_PATH || '/tmp/sessions',
  };
}

export const env = validateEnv();
