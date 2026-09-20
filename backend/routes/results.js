import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.get('/me/results', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`SELECT c.course_code, c.course_name, c.credit_hours AS credits, r.semester, r.academic_year, r.grade, r.grade_point
      FROM results r JOIN courses c ON c.course_id = r.course_id WHERE r.student_id = ? ORDER BY r.academic_year, r.semester, c.course_code`, [req.studentId]);
    const totalCredits = rows.reduce((sum, row) => sum + Number(row.credits), 0);
    const weightedPoints = rows.reduce((sum, row) => sum + Number(row.credits) * Number(row.grade_point), 0);
    return res.json({ results: rows, summary: { totalCredits, gpa: totalCredits ? Number((weightedPoints / totalCredits).toFixed(2)) : 0 } });
  } catch (error) { return next(error); }
});
export default router;
