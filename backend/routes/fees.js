import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.get('/me/fees', requireAuth, async (req, res, next) => {
  try {
    const [feeRows] = await pool.execute('SELECT description, amount, due_date, status FROM fees WHERE student_id = ? ORDER BY due_date', [req.studentId]);
    const [paymentRows] = await pool.execute('SELECT payment_date, description, amount, payment_method, reference FROM payments WHERE student_id = ? ORDER BY payment_date', [req.studentId]);
    const totalFees = feeRows.reduce((sum, fee) => sum + Number(fee.amount), 0);
    const amountPaid = paymentRows.reduce((sum, payment) => sum + Number(payment.amount), 0);
    return res.json({ summary: { totalFees, amountPaid, outstanding: Math.max(totalFees - amountPaid, 0) }, fees: feeRows, payments: paymentRows });
  } catch (error) { return next(error); }
});
export default router;
