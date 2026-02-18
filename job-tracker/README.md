# Job Tracker CRM

## What It Is
Job Tracker CRM is a minimal MVP for tracking property maintenance jobs.  
It is focused on day-to-day painting workflow:
- properties
- jobs per property
- paint records by room
- access/key notes

## MVP Features
- Properties list page with search by `addressLine` or `postcode`
- New property flow (`/properties/new`)
- Property detail page (`/properties/[id]`) with:
  - header and access notes
  - job history
  - latest paint by room (most recent record per room)
- Add job flow (`/properties/[id]/jobs/new`) with up to 3 paint records
- Job detail page (`/jobs/[jobId]`) with paint records and optional photo upload

## Tech Stack
- Next.js (App Router) + React
- TypeScript
- Prisma ORM
- PostgreSQL (local Prisma dev DB in this setup)

## How To Run
1. Install dependencies:
```bash
npm ci
```

2. Create env file:
```bash
cp .env.example .env
```
Windows CMD:
```cmd
copy .env.example .env
```

3. Start Prisma local DB service (keep running):
```bash
npx prisma dev
```

4. Apply database migrations:
```bash
npx prisma migrate dev --name init_job_tracker_crm
```

5. (Optional) Seed demo data:
```bash
npm run seed
```

6. Start the app:
```bash
npm run dev
```

7. Open:
- `http://localhost:3000`

## Demo Seed Data
`prisma/seed.sql` inserts:
- 2 properties
- 4 jobs (2 each)
- 8 paint records across multiple rooms

Run:
```bash
npm run seed
```

## Screenshots
Use `docs/screenshots/` to store demo screenshots.

## Future Ideas
- Better photo handling (multiple photos per paint record, compression, metadata)
- Auth and multi-user accounts
- File attachments for invoices/quotes
- Job status and reminders
- CSV/PDF export
- Tenant/contact management
- Audit trail and activity history

_Deployment trigger note updated on 2026-02-18._
