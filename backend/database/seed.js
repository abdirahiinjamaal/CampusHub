import bcrypt from 'bcrypt';
import { pool } from '../db.js';

const students = [
  ['STU-2026-001', 'Ahmed', 'Mohamed', 'ahmed.mohamed@example.edu', 'Faculty of Computing', 'BSc Computer Science', 2026],
  ['STU-2026-002', 'Fatima', 'Ali', 'fatima.ali@example.edu', 'Faculty of Business', 'BSc Business Administration', 2026],
  ['STU-2026-003', 'Omar', 'Hassan', 'omar.hassan@example.edu', 'Faculty of Computing', 'BSc Software Engineering', 2026],
];
const courses = [
  ['CS101', 'Introduction to Computer Science', 3, 'A', 4.0], ['CS102', 'Programming I', 3, 'A-', 3.7], ['CS201', 'Data Structures', 3, 'B+', 3.3], ['NET101', 'Computer Networks', 3, 'A', 4.0], ['DB101', 'Database Systems', 3, 'A-', 3.7],
];

try {
  const passwordHash = await bcrypt.hash('student123', 12);
  for (const student of students) await pool.execute(`INSERT INTO students (student_id, first_name, last_name, email, faculty, program, enrollment_year, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE first_name=VALUES(first_name), last_name=VALUES(last_name), password_hash=VALUES(password_hash)`, [...student, passwordHash]);
  for (const [code, name, credits] of courses) await pool.execute('INSERT INTO courses (course_code, course_name, credit_hours) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE course_name=VALUES(course_name), credit_hours=VALUES(credit_hours)', [code, name, credits]);
  const [courseRows] = await pool.execute('SELECT course_id, course_code FROM courses WHERE course_code IN (?, ?, ?, ?, ?)', courses.map((course) => course[0]));
  const courseIds = Object.fromEntries(courseRows.map((row) => [row.course_code, row.course_id]));
  for (const studentId of students.map((student) => student[0])) {
    await pool.execute('DELETE FROM results WHERE student_id = ?', [studentId]);
    for (const [code, , credits, grade, point] of courses) await pool.execute('INSERT INTO results (student_id, course_id, semester, academic_year, grade, grade_point) VALUES (?, ?, ?, ?, ?, ?)', [studentId, courseIds[code], code === 'CS101' || code === 'CS102' || code === 'CS201' ? 'Semester 1' : 'Semester 2', 2026, grade, point]);
    await pool.execute('DELETE FROM fees WHERE student_id = ?', [studentId]);
    await pool.execute('DELETE FROM payments WHERE student_id = ?', [studentId]);
    for (const fee of [['Tuition Fee', 1500, '2026-09-30', 'PAID'], ['Registration', 500, '2026-09-30', 'PAID'], ['Tuition Fee', 1050, '2026-09-30', 'PAID']]) await pool.execute('INSERT INTO fees (student_id, description, amount, due_date, status) VALUES (?, ?, ?, ?, ?)', [studentId, ...fee]);
    for (const payment of [['Tuition Fee', 1500, '2026-09-01', 'Bank transfer', `${studentId}-PAY-001`], ['Registration', 500, '2026-09-05', 'Card', `${studentId}-PAY-002`], ['Tuition Fee', 1050, '2026-09-10', 'Bank transfer', `${studentId}-PAY-003`]]) await pool.execute('INSERT INTO payments (student_id, description, amount, payment_date, payment_method, reference) VALUES (?, ?, ?, ?, ?, ?)', [studentId, ...payment]);
    await pool.execute('INSERT INTO fees (student_id, description, amount, due_date, status) VALUES (?, ?, ?, ?, ?)', [studentId, 'Outstanding Balance', 450, '2026-09-30', 'PENDING']);
  }
  console.log('Seed complete.');
} finally { await pool.end(); }
