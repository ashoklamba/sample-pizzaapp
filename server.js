import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/pizzas", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, description, price_cents FROM pizzas ORDER BY id"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to load pizzas." });
  }
});

app.post("/api/orders", async (req, res) => {
  const { customer_name, pizza_id, quantity } = req.body || {};
  if (!customer_name || !pizza_id || !quantity) {
    return res.status(400).json({ error: "Missing order fields." });
  }

  try {
    const { rows: pizzaRows } = await pool.query(
      "SELECT price_cents FROM pizzas WHERE id = $1",
      [pizza_id]
    );
    if (!pizzaRows.length) {
      return res.status(404).json({ error: "Pizza not found." });
    }

    const total_cents = pizzaRows[0].price_cents * Number(quantity);
    const { rows } = await pool.query(
      `INSERT INTO orders (customer_name, pizza_id, quantity, total_cents)
       VALUES ($1, $2, $3, $4)
       RETURNING id, customer_name, pizza_id, quantity, total_cents, created_at`,
      [customer_name, pizza_id, quantity, total_cents]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to place order." });
  }
});

app.listen(PORT, () => {
  console.log(`Pizza app running on http://localhost:${PORT}`);
});
