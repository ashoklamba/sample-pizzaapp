import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/pizzaapp",
  ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : false
});
