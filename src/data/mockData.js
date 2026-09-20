export const students = {
  'STU-2026-001': { fullName: 'Ahmed Mohamed', email: 'ahmed.mohamed@example.edu', program: 'BSc Computer Science', faculty: 'Faculty of Computing', enrollmentYear: '2026', semester: 'Semester 2', gpa: '3.72', credits: '72' },
  'STU-2026-002': { fullName: 'Leila Hassan', email: 'leila.hassan@example.edu', program: 'BSc Information Systems', faculty: 'Faculty of Computing', enrollmentYear: '2026', semester: 'Semester 2', gpa: '3.84', credits: '72' },
  'STU-2026-003': { fullName: 'Daniel Kimani', email: 'daniel.kimani@example.edu', program: 'BSc Data Science', faculty: 'Faculty of Science', enrollmentYear: '2026', semester: 'Semester 2', gpa: '3.51', credits: '69' },
};

export const results = [
  { course: 'Introduction to Computer Science', code: 'CS101', credits: 3, grade: 'A', point: '4.0' },
  { course: 'Programming I', code: 'CS102', credits: 3, grade: 'A-', point: '3.7' },
  { course: 'Data Structures', code: 'CS201', credits: 3, grade: 'B+', point: '3.3' },
  { course: 'Computer Networks', code: 'NET101', credits: 3, grade: 'A', point: '4.0' },
  { course: 'Database Systems', code: 'DB101', credits: 3, grade: 'A-', point: '3.7' },
];

export const fees = { total: 3500, paid: 3050, outstanding: 450, history: [
  { date: 'Sep 01, 2026', description: 'Tuition Fee', amount: 1500, status: 'Paid' },
  { date: 'Sep 05, 2026', description: 'Registration', amount: 500, status: 'Paid' },
  { date: 'Sep 10, 2026', description: 'Tuition Fee', amount: 1050, status: 'Paid' },
  { date: 'Sep 15, 2026', description: 'Outstanding Balance', amount: 450, status: 'Pending' },
] };

export const transcript = { semesters: [{ name: 'Semester 1 · 2026', courses: results.slice(0, 3) }, { name: 'Semester 2 · 2026', courses: results.slice(3) }] };
