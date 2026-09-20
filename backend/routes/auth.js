import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { getConfig } from '../config/secrets.js';

const router = Router();
router.post('/login', async (req, res, next) => {
  try {
    const studentId = String(req.body?.studentId || '').trim().toUpperCase();
    const password = String(req.body?.password || '');
    if (!studentId || !password) return res.status(400).json({ error: 'Student ID and password are required' });
    const [rows] = await pool.execute('SELECT student_id, first_name, last_name, email, faculty, program, enrollment_year, password_hash FROM students WHERE student_id = ?', [studentId]);
    const student = rows[0];
    if (!student || !(await bcrypt.compare(password, student.password_hash))) return res.status(401).json({ error: 'Invalid credentials' });
    const config = await getConfig();
    const token = jwt.sign({ studentId: student.student_id }, config.jwtSecret, { expiresIn: '8h' });
    const { password_hash: _passwordHash, ...safeStudent } = student;
    return res.json({ message: 'Login successful', token, student: safeStudent });
  } catch (error) { return next(error); }
});
export default router;
