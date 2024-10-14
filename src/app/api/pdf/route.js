// File: /app/api/media/pdf/route.ts
import { jsPDF } from 'jspdf';
import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 });
  }

  try {
    const query = 'SELECT * FROM product WHERE date >= $1 AND date <= $2';
    const values = [startDate, endDate];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'No data found for the given dates' }, { status: 404 });
    }

    const doc = new jsPDF();
    doc.text(`Data between ${startDate} and ${endDate}`, 10, 10);

    let yPosition = 20;
    result.rows.forEach((row, index) => {
      doc.text(`Record ${index + 1}`, 10, yPosition);
      doc.text(`Date: ${row.date}`, 10, yPosition + 10);
      doc.text(`Party: ${row.party}`, 10, yPosition + 20);
      doc.text(`Quality: ${row.quality}`, 10, yPosition + 30);
      doc.text(`Finishing: ${row.finishing}`, 10, yPosition + 40);
      doc.text(`Out Date: ${row.outdate}`, 10, yPosition + 50);
      doc.text(`Gray In: ${row.grayin}`, 10, yPosition + 60);
      doc.text(`Gray Out: ${row.grayout}`, 10, yPosition + 70);
      doc.text(`Bill: ${row.bill}`, 10, yPosition + 80);
      yPosition += 90;
    });

    const pdfBytes = doc.output('arraybuffer');
    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="data_${startDate}_to_${endDate}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
