# Sample Pizza App

Small full-stack pizza app with a Postgres-backed API and a static frontend.

## Setup

1. Create the database:

```bash
createdb pizzaapp
```

2. Apply schema + seed data:

```bash
psql pizzaapp -f sql/schema.sql
psql pizzaapp -f sql/seed.sql
```

3. Install dependencies and run:

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Environment

- `DATABASE_URL` (optional) defaults to `postgres://postgres:postgres@localhost:5432/pizzaapp`
- `PGSSLMODE=require` if needed for hosted Postgres.

## Docker

Build the image:

```bash
docker build -t pizzaapp .
```

Run it (replace the database URL with your Postgres host):

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgres://postgres:postgres@host.docker.internal:5432/pizzaapp" \
  pizzaapp
```

Or run Postgres + the app together with Docker Compose:

```bash
docker compose up --build
```
