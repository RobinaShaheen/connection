import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request:any) {
  const { searchParams } = new URL(request.url);
  const bookName = searchParams.get('bookName');
  const Price = searchParams.get('Price');

  try {
    if (!bookName || !Price) throw new Error('Book Name and Price required');

    await sql`
      INSERT INTO Books (Name, Price) 
      VALUES (${bookName}, ${Price});
    `;
    
    const Books = await sql`
      SELECT * FROM Books;
    `;
    return NextResponse.json({ Books }, { status: 200 });
  } catch (error:any) {
    console.error('Error inserting data or fetching books:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
