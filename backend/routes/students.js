import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT student_id, first_name, last_name, email, faculty, program, enrollment_year FROM students WHERE student_id = ?', [req.studentId]);
    if (!rows[0]) return res.status(404).json({ error: 'Student not found' });
    return res.json(rows[0]);
  } catch (error) { return next(error); }
});
export default router;
