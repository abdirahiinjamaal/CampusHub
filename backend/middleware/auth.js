import jwt from 'jsonwebtoken';
import { getConfig } from '../config/secrets.js';

export async function requireAuth(req, res, next) {
  const header = req.get('authorization');
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const config = await getConfig();
    const payload = jwt.verify(header.slice(7), config.jwtSecret);
    req.studentId = payload.studentId;
    return next();
  } catch { return res.status(401).json({ error: 'Unauthorized' }); }
}
