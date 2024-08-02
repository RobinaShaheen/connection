// src/app/api/usersadd/route.js

import pool from '../../../../lib/db';

export default async (req, res) => {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        const { id, name, price } = req.body;
        const query = 'INSERT INTO books (id, name, price) VALUES ($1, $2, $3) RETURNING *';
        const values = [id, name, price];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
        break;
      case 'PUT':
        const { id: updateId, name: updateName, price: updatePrice } = req.body;
        const updateQuery = 'UPDATE books SET name = $2, price = $3 WHERE id = $1 RETURNING *';
        const updateValues = [updateId, updateName, updatePrice];
        const updateResult = await pool.query(updateQuery, updateValues);
        res.status(200).json(updateResult.rows[0]);
        break;
      case 'DELETE':
        const { id: deleteId } = req.body;
        const deleteQuery = 'DELETE FROM books WHERE id = $1';
        const deleteValues = [deleteId];
        await pool.query(deleteQuery, deleteValues);
        res.status(204).end();
        break;
      case 'GET':
        const selectResult = await pool.query('SELECT * FROM books');
        res.status(200).json(selectResult.rows);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
