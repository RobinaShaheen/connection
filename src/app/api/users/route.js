// src/app/api/users/route.js
// import { sql } from '@vercel/postgres';
import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM books');
    return NextResponse.json(result.rows);
  } 
  catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id, name, price } = await request.json();
    if (!id || !name || !price) {
      return NextResponse.json({ error: 'Id, Name and price are required' }, { status: 400 });
    }

    const query = 'INSERT INTO books (id, name, price) VALUES ($1, $2, $3) RETURNING *';
    const values = [id, name, price];
    const result = await pool.query(query, values);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, price } = await request.json();
    if (!id || !name || !price) {
      return NextResponse.json({ error: 'Id, name, and price are required' }, { status: 400 });
    }

    const query = 'UPDATE books SET name = $2, price = $3 WHERE id = $1 RETURNING *';
    const values = [id, name, price];
    const result = await pool.query(query, values);
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Id is required' }, { status: 400 });
    }

    const query = 'DELETE FROM books WHERE id = $1';
    const values = [id];
    await pool.query(query, values);
    return NextResponse.json({ message: 'Book deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
