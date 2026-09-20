import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.get('/me/transcript', requireAuth, async (req, res, next) => {
  try {
    const [studentRows] = await pool.execute('SELECT student_id, first_name, last_name, email, faculty, program, enrollment_year FROM students WHERE student_id = ?', [req.studentId]);
    if (!studentRows[0]) return res.status(404).json({ error: 'Student not found' });
    const [results] = await pool.execute(`SELECT c.course_code, c.course_name, c.credit_hours AS credits, r.semester, r.academic_year, r.grade, r.grade_point
      FROM results r JOIN courses c ON c.course_id = r.course_id WHERE r.student_id = ? ORDER BY r.academic_year, r.semester, c.course_code`, [req.studentId]);
    const totalCredits = results.reduce((sum, row) => sum + Number(row.credits), 0);
    const weightedPoints = results.reduce((sum, row) => sum + Number(row.credits) * Number(row.grade_point), 0);
    const gpa = totalCredits ? Number((weightedPoints / totalCredits).toFixed(2)) : 0;
    return res.json({ student: studentRows[0], results, summary: { totalCredits, gpa, academicStanding: gpa >= 2 ? 'Good' : 'Probation' } });
  } catch (error) { return next(error); }
});
export default router;
