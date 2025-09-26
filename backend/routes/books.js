import express from "express";
import db from "../db.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API za upravljanje knjigama
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Dohvati sve knjige
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Lista svih knjiga
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM books");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Dohvati knjigu po ID-u
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Knjiga pronađena
 *       404:
 *         description: Knjiga nije pronađena
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Book not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Dodaj novu knjigu (samo admin)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author_id:
 *                 type: integer
 *               published_year:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Knjiga dodana
 */
router.post("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { title, author_id, published_year, category } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO books (title, author_id, published_year, category) VALUES (?, ?, ?, ?)",
      [title, author_id, published_year, category]
    );
    res.status(201).json({ id: result.insertId, title, author_id, published_year, category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Ažuriraj knjigu (samo admin)
 *     tags: [Books]
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
 *               title:
 *                 type: string
 *               author_id:
 *                 type: integer
 *               published_year:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Knjiga ažurirana
 */
router.put("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { title, author_id, published_year, category } = req.body;
  try {
    await db.query(
      "UPDATE books SET title=?, author_id=?, published_year=?, category=? WHERE id=?",
      [title, author_id, published_year, category, req.params.id]
    );
    res.json({ message: "Book updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Obriši knjigu (samo admin)
 *     tags: [Books]
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
 *         description: Knjiga obrisana
 */
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    await db.query("DELETE FROM books WHERE id=?", [req.params.id]);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
