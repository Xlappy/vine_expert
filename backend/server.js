import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Routes

// GET /api/wines
app.get('/api/wines', (req, res, next) => {
    // Add a small delay for realistic loading simulation if desired, 
    // but for now we'll keep it fast.
    const sql = 'SELECT * FROM wines';
    db.all(sql, [], (err, rows) => {
        if (err) {
            next(err);
            return;
        }
        res.json(rows);
    });
});

// GET /api/wines/:id
app.get('/api/wines/:id', (req, res, next) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM wines WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            next(err);
            return;
        }
        if (!row) {
            return res.status(404).json({ error: 'Wine not found' });
        }
        res.json(row);
    });
});

// POST /api/wines
app.post('/api/wines', (req, res, next) => {
    // Validate required fields
    const { name, type, price } = req.body;
    if (!name || name.trim() === '' || !type || !price) {
        return res.status(400).json({ error: 'Name, type, and price are required fields.' });
    }

    const sql = `INSERT INTO wines (
    name, type, country, region, year, rating, price, description, image_url,
    grape, body, tannins, acidity, sweetness, alcohol, aroma, foodPairing, agingMonths
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        req.body.name,
        req.body.type,
        req.body.country || 'Unknown',
        req.body.region,
        req.body.year || 0,
        req.body.rating || 0,
        req.body.price,
        req.body.description || '',
        req.body.image_url || null,
        req.body.grape || '',
        req.body.body || 0,
        req.body.tannins || 0,
        req.body.acidity || 0,
        req.body.sweetness || 0,
        req.body.alcohol || '',
        req.body.aroma || '',
        req.body.foodPairing || '',
        req.body.agingMonths || 0
    ];

    db.run(sql, params, function (err) {
        if (err) {
            next(err);
            return;
        }
        res.status(201).json({
            id: this.lastID,
            ...req.body
        });
    });
});

// PUT /api/wines/:id
app.put('/api/wines/:id', (req, res, next) => {
    const { id } = req.params;
    const wineToUpdate = req.body;

    const keys = Object.keys(wineToUpdate);
    if (keys.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
    }

    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = keys.map(key => wineToUpdate[key]);
    values.push(id);

    const sql = `UPDATE wines SET ${setClause} WHERE id = ?`;

    db.run(sql, values, function (err) {
        if (err) {
            next(err);
            return;
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Wine not found' });
        }
        res.json({ message: 'Wine updated successfully', changes: this.changes });
    });
});

// DELETE /api/wines/:id
app.delete('/api/wines/:id', (req, res, next) => {
    const { id } = req.params;
    const sql = 'DELETE FROM wines WHERE id = ?';

    db.run(sql, id, function (err) {
        if (err) {
            next(err);
            return;
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Wine not found' });
        }
        res.json({ message: 'Wine deleted successfully' });
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
