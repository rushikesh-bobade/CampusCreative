import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT * FROM design_concepts ORDER BY created_at DESC');
      return NextResponse.json(res.rows);
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const client = await pool.connect();
    
    try {
      if (data.action === 'delete') {
        await client.query('DELETE FROM design_concepts WHERE id = $1', [data.id]);
        return NextResponse.json({ success: true });
      }
      
      const { title, description, prompt, palette, typography, layout_advice } = data;
      const res = await client.query(
        'INSERT INTO design_concepts (title, description, prompt, palette, typography, layout_advice) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description, prompt, palette, typography, layout_advice]
      );
      return NextResponse.json(res.rows[0]);
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
