import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import 'dotenv/config';

let configPromise;

function parseSecret(secretName, secretValue) {
  if (!secretValue) throw new Error(`AWS secret ${secretName} did not contain a value`);
  try { return JSON.parse(secretValue); } catch { throw new Error(`AWS secret ${secretName} is not valid JSON`); }
}

function requireValue(value, name) {
  if (value === undefined || value === null || value === '') throw new Error(`Missing configuration value: ${name}`);
  return value;
}

function getFrontendOrigins() {
  const configured = process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN;
  if (configured) return configured.split(',').map((origin) => origin.trim()).filter(Boolean);
  return (process.env.NODE_ENV || 'development').toLowerCase() === 'production' ? [] : ['http://localhost:5173', 'http://localhost:4173'];
}

async function readSecret(client, secretName) {
  const response = await client.send(new GetSecretValueCommand({ SecretId: secretName }));
  return parseSecret(secretName, response.SecretString);
}

async function loadConfig() {
  const production = (process.env.NODE_ENV || 'development').toLowerCase() === 'production';
  if (!production) {
    return {
      isProduction: false,
      port: Number(process.env.PORT || 3000),
      frontendOrigins: getFrontendOrigins(),
      jwtSecret: requireValue(process.env.JWT_SECRET || 'change-this-in-production', 'JWT_SECRET'),
      database: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'university',
      },
    };
  }

  const client = new SecretsManagerClient({ region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1' });
  const [databaseSecret, jwtSecret] = await Promise.all([
    readSecret(client, process.env.DATABASE_SECRET_NAME || 'campushub/database'),
    readSecret(client, process.env.JWT_SECRET_NAME || 'campushub/jwt'),
  ]);
  return {
    isProduction: true,
    port: Number(process.env.PORT || 3000),
    frontendOrigins: getFrontendOrigins(),
    jwtSecret: requireValue(jwtSecret.secret, 'JWT secret'),
    database: {
      host: requireValue(databaseSecret.host, 'database host'),
      port: Number(databaseSecret.port || 3306),
      user: requireValue(databaseSecret.username, 'database username'),
      password: requireValue(databaseSecret.password, 'database password'),
      database: requireValue(databaseSecret.database, 'database name'),
    },
  };
}

export function getConfig() {
  if (!configPromise) configPromise = loadConfig();
  return configPromise;
}
