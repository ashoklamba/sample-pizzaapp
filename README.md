# Sample Pizza App

Small full-stack pizza app with a Postgres-backed API and a static frontend.

## Setup

1. Create the database:

createdb pizzaapp


2. Apply schema + seed data:


psql pizzaapp -f sql/schema.sql
psql pizzaapp -f sql/seed.sql

3. Install dependencies and run:


npm install
npm run dev


App runs at `http://localhost:3000`.

## Environment

- `DATABASE_URL` (optional) defaults to `postgres://postgres:postgres@localhost:5432/pizzaapp`
- `PGSSLMODE=require` if needed for hosted Postgres.

## Docker

Build the image:

docker build -t pizzaapp .


Run it (replace the database URL with your Postgres host):


docker run -p 3000:3000 \
  -e DATABASE_URL="postgres://postgres:postgres@host.docker.internal:5432/pizzaapp" \
  pizzaapp


Or run Postgres + the app together with Docker Compose:


docker compose up --build


## Playwright E2E tests

1. Install Playwright (and browsers):

npm install
npx playwright install


2. Ensure Postgres is running and seeded (see Setup above).

3. Run the tests:

npm run test:e2e
npx playwright test

4. Browser Capabilities

npx playwright test --project=chromium

npx playwright test --headed 

headless: npx playwright test

npx playwright test --headed --worker=1

5. Running on Hub-->Update playwright.configs

use: {
  connectOptions: {
    wsEndpoint: process.env.PLAYWRIGHT_WS_ENDPOINT
  }
}

PLAYWRIGHT_WS_ENDPOINT=ws://your-hub:port/playwright npx playwright test



