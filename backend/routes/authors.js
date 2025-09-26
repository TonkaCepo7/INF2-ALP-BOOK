import express from "express";
import db from "../db.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: API za upravljanje autorima
 */

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Dohvati sve autore
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Lista svih autora
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM authors");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     summary: Dohvati autora po ID-u
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Podaci o autoru
 *       404:
 *         description: Author not found
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM authors WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Author not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Dodaj novog autora (samo admin)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Autor uspješno dodan
 */
router.post("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { name, bio } = req.body;
  try {
    const [result] = await db.query("INSERT INTO authors (name, bio) VALUES (?, ?)", [name, bio]);
    res.status(201).json({ id: result.insertId, name, bio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Ažuriraj autora (samo admin)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autor ažuriran
 */
router.put("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { name, bio } = req.body;
  try {
    await db.query("UPDATE authors SET name=?, bio=? WHERE id=?", [name, bio, req.params.id]);
    res.json({ message: "Author updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/authors/{id}:
 *   delete:
 *     summary: Obriši autora (samo admin)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Autor obrisan
 */
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    await db.query("DELETE FROM authors WHERE id=?", [req.params.id]);
    res.json({ message: "Author deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
