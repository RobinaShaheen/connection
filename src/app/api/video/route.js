import { sql } from '@vercel/postgres';
import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const videos = await pool.query(`SELECT * FROM video`);
    return NextResponse.json(videos.rows);
}

export async function POST(request) {
    const { id, file, description } = await request.json();

    if (!id || !file || !description) {
        return NextResponse.json({ error: 'Id, file, and description are required' }, { status: 400 });
    }

    try {
        const query = 'INSERT INTO video (id, file, description) VALUES (${id}, ${file}, ${description})';
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
        const query = 'UPDATE video SET file = ${file}, description = ${description} WHERE id = ${id}';
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
        const query = 'DELETE FROM video WHERE id = ${id}';
        const values = [id];
        await pool.query(query, values);
        return NextResponse.json({ message: 'Video deleted successfully' }, { status: 200 });
    } 
    catch (error) {
        console.error('Error deleting data:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
