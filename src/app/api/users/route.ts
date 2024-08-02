import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    const books = await sql`SELECT * FROM books`;
    return NextResponse.json(books.rows);
}

export async function POST(request:any) {
    const { id, name, price } = await request.json();
    
    if (!id || !name || !price) {
        return NextResponse.json({ error: 'Id, Name and price are required' }, { status: 400 });
    }

    try {
        await sql`INSERT INTO books (id, name, price) VALUES (${id}, ${name}, ${price})`;
        return NextResponse.json({ message: 'Book added successfully' }, { status: 200 });
    } catch (error:any) {
        console.error('Error inserting data:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request:any) {
  const { id, name, price } = await request.json();
  
  if (!id || !name || !price) {
      return NextResponse.json({ error: 'Id, name, and price are required' }, { status: 400 });
  }

  try {
      await sql`UPDATE books SET name = ${name}, price = ${price} WHERE id = ${id}`;
      return NextResponse.json({ message: 'Book updated successfully' }, { status: 200 });
  } catch (error:any) {
      console.error('Error updating data:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request:any) {
  const { id } = await request.json();

  if (!id) {
      return NextResponse.json({ error: 'Id is required' }, { status: 400 });
  }

  try {
      await sql`DELETE FROM books WHERE id = ${id}`;
      return NextResponse.json({ message: 'Book deleted successfully' }, { status: 200 });
  } catch (error:any) {
      console.error('Error deleting data:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
