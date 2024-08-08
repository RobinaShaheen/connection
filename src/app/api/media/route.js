import { sql } from '@vercel/postgres';
import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const product = await pool.query('SELECT * FROM product');
    return NextResponse.json(product.rows);
}

export async function POST(request) {
    const { id, file, description } = await request.json();
    
    if (!id || !file || !description) {
        return NextResponse.json({ error: 'Id, file, and description are required' }, { status: 400 });
    }

    try {
        const query = 'INSERT INTO product (id, file, description) VALUES ($1, $2, $3) RETURNING *';
        const values = [id, file, description];
        const result = await pool.query(query, values);
        return NextResponse.json(result.rows[0], { status: 200 });
    } 
    catch (error) {
        console.error('Error inserting data:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    const { id, file, description } = await request.json();
    
    if (!id || !file || !description) {
        return NextResponse.json({ error: 'Id, file, and description are required' }, { status: 400 });
    }

    try {
        const query = 'UPDATE product SET file = $2, description = $3 WHERE id = $1 RETURNING *';
        const values = [id, file, description];
        const result = await pool.query(query, values);
        return NextResponse.json(result.rows[0], { status: 200 });
    } 
    catch (error) {
        console.error('Error updating data:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({ error: 'Id is required' }, { status: 400 });
    }

    try {
        const query = 'DELETE FROM product WHERE id = $1';
        const values = [id];
        await pool.query(query, values);
        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } 
    catch (error) {
        console.error('Error deleting data:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
