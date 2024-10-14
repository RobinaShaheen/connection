import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const product = await pool.query('SELECT * FROM product');
    return NextResponse.json(product.rows);
}

export async function POST(request) {
    const data = await request.json();
    console.log('Received data:', data); // Add this to log received data

    const { date, Party: party, Quality: quality, Finishing: finishing, outDate: outdate, Grayin: grayin, Grayout: grayout, bill } = data;

    try {
        const query = 'INSERT INTO product (date, party, quality, finishing, outdate, grayin, grayout, bill) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
        const values = [date, party, quality, finishing, outdate, grayin, grayout, bill];
        const result = await pool.query(query, values);
        return NextResponse.json(result.rows[0], { status: 200 });
    } 
    catch (error) {
        console.error('Error inserting data:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
      // Parse the request body and normalize keys
      const body = await request.json();
      const { date, party, quality, finishing, outDate, grayin, grayout, bill } = {
        date: body.date,
        party: body.Party,
        quality: body.Quality,
        finishing: body.Finishing,
        outDate: body.outDate,
        grayin: body.Grayin,
        grayout: body.Grayout,
        bill: body.bill
      };
  
      console.log("Normalized body:", { date, party, quality, finishing, outDate, grayin, grayout, bill });
  
      // Validate required fields
      if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });
      if (!party) return NextResponse.json({ error: 'Party is required' }, { status: 400 });
      if (!quality) return NextResponse.json({ error: 'Quality is required' }, { status: 400 });
      if (!finishing) return NextResponse.json({ error: 'Finishing is required' }, { status: 400 });
      if (!outDate) return NextResponse.json({ error: 'Out Date is required' }, { status: 400 });
      if (!grayin) return NextResponse.json({ error: 'Grayin is required' }, { status: 400 });
      if (!grayout) return NextResponse.json({ error: 'Grayout is required' }, { status: 400 });
      if (!bill) return NextResponse.json({ error: 'Bill is required' }, { status: 400 });
  
      // Convert date fields to ISO string format
      const formattedDate = new Date(date).toISOString();
      const formattedOutDate = new Date(outDate).toISOString();
  
      // SQL query with placeholders
      const query = `
        UPDATE product 
        SET party = $2, quality = $3, finishing = $4, outdate = $5, grayin = $6, grayout = $7, bill = $8 
        WHERE date = $1 
        RETURNING *;
      `;
  
      // Query parameter values
      const values = [formattedDate, party, quality, finishing, formattedOutDate, grayin, grayout, bill];
  
      console.log("Executing query with values:", values); // Log the values used in the query
  
      // Execute the query
      const result = await pool.query(query, values);
      console.log(result);
      // Check if a row was updated
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Product not found or no changes made' }, { status: 404 });
      }
  
      // Return the updated product
      return NextResponse.json(result.rows[0], { status: 200 });
    } 
    catch (error) {
      console.error('Error updating data:', error);
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}
  

export async function DELETE(request) {
    const { date } = await request.json();

    if (!date) {
        return NextResponse.json({ error: 'date is required' }, { status: 400 });
    }

    try {
        const query = 'DELETE FROM product WHERE date = $1';
        const values = [date];
        await pool.query(query, values);
        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } 
    catch (error) {
        console.error('Error deleting data:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
