import express, { Request, Response } from "express";
import { Pool } from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  ssl: {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "true",
  },
});

app.get("/", async (req: Request, res: Response) => {
  try {
    res.json({
      title: "Welcome to kargo server",
      description: "This is a kargo server lander",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Something went wrong" });
  }
});

app.get("/curriculum", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM curriculum_kargo");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
