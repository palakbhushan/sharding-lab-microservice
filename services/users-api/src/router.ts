import { Router } from "express";
import { getDb } from "./db";
import { v4 as uuidv4 } from "uuid";

const router = Router();

router.post("/users", async (req, res) => {
    const id = uuidv4();
    const { name, email } = req.body;
    const db = getDb(id);

    await db.query("INSERT INTO users (id, name, email) VALUES ($1, $2, $3)", [
        id,
        name,
        email,
    ]);

    res.json({ id, name, email });
});

router.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    const db = getDb(id);

    const result = await db.query("SELECT * FROM users WHERE id=$1", [id]);
    res.json(result.rows[0] || null);
});

export default router;
