const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiError extends Error { constructor(message, status) { super(message); this.status = status; } }
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}), ...(localStorage.getItem('horizonToken') ? { Authorization: `Bearer ${localStorage.getItem('horizonToken')}` } : {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) { if (response.status === 401) localStorage.removeItem('horizonToken'); throw new ApiError(body.error || 'Unable to complete request', response.status); }
  return body;
}
const mapStudent = (student) => ({ ...student, studentId: student.student_id, fullName: `${student.first_name} ${student.last_name}`, semester: 'Semester 2', gpa: student.gpa || '0.00', credits: String(student.credits || 0) });
const mapResult = (row) => ({ course: row.course_name, code: row.course_code, credits: Number(row.credits), semester: row.semester, academicYear: row.academic_year, grade: row.grade, point: Number(row.grade_point).toFixed(1) });
const formatDate = (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' });
export const api = {
  login: async (studentId, password) => { try { const body = await request('/login', { method: 'POST', body: JSON.stringify({ studentId, password }) }); localStorage.setItem('horizonToken', body.token); return mapStudent(body.student); } catch (error) { if (error.status === 401) return null; throw error; } },
  getStudent: async () => mapStudent(await request('/student/me')),
  getResults: async () => { const body = await request('/student/me/results'); return { rows: body.results.map(mapResult), summary: body.summary }; },
  getFees: async () => { const body = await request('/student/me/fees'); return { total: body.summary.totalFees, paid: body.summary.amountPaid, outstanding: body.summary.outstanding, history: [...body.payments.map((row) => ({ date: formatDate(row.payment_date), description: row.description, amount: Number(row.amount), status: 'Paid' })), ...body.fees.filter((row) => row.status !== 'PAID').map((row) => ({ date: formatDate(row.due_date), description: row.description, amount: Number(row.amount), status: row.status[0] + row.status.slice(1).toLowerCase() }))] }; },
  getTranscript: async () => { const body = await request('/student/me/transcript'); const grouped = body.results.map(mapResult).reduce((groups, row) => ({ ...groups, [`${row.semester} · ${row.academicYear}`]: [...(groups[`${row.semester} · ${row.academicYear}`] || []), row] }), {}); return { semesters: Object.entries(grouped).map(([name, courses]) => ({ name, courses })) }; },
  clearSession: () => localStorage.removeItem('horizonToken'),
};
