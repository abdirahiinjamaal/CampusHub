# Horizon University Student Portal

Small React + Express + MySQL student portal. The frontend stays in `src/`; the backend is isolated in `backend/`.

## Run it

1. Create a MySQL database and tables:

   ```bash
   mysql -u root -p < backend/database/schema.sql
   ```

2. Install backend dependencies and configure the environment:

   ```bash
   cd backend
   npm install
   copy .env.example .env
   npm run seed
   npm start
   ```

3. In a second terminal, run the frontend from the project root:

   ```bash
   npm install
   npm run dev
   ```

Demo login: `STU-2026-001` / `student123`.

## API

- `GET /health` — database health check
- `POST /api/login` — bcrypt login and JWT response
- `GET /api/student/me` — authenticated student profile
- `GET /api/student/me/results` — results plus calculated GPA
- `GET /api/student/me/fees` — fees, payments, and calculated totals
- `GET /api/student/me/transcript` — transcript plus academic standing

All student endpoints require `Authorization: Bearer <token>`. Queries use parameter placeholders and responses never expose `password_hash`.
