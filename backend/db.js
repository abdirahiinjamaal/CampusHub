import mysql from 'mysql2/promise';
import { getConfig } from './config/secrets.js';

let mysqlPoolPromise;
async function getPool() {
  if (!mysqlPoolPromise) {
    mysqlPoolPromise = getConfig().then((config) => mysql.createPool({
      ...config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }));
  }
  return mysqlPoolPromise;
}

// Keep the existing pool.execute() call sites unchanged while creating the
// pool only after local env or AWS Secrets Manager configuration is loaded.
export const pool = {
  execute: (...args) => getPool().then((connectionPool) => connectionPool.execute(...args)),
  getConnection: (...args) => getPool().then((connectionPool) => connectionPool.getConnection(...args)),
  end: (...args) => getPool().then((connectionPool) => connectionPool.end(...args)),
};

export async function checkDatabase() {
  const connection = await pool.getConnection();
  try { await connection.ping(); return true; } finally { connection.release(); }
}
