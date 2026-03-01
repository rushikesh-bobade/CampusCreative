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
      const res = await client.query('SELECT * FROM generations ORDER BY created_at DESC LIMIT 5');
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
    const { type, content } = await req.json();
    const client = await pool.connect();
    
    try {
      const res = await client.query(
        'INSERT INTO generations (type, content) VALUES ($1, $2) RETURNING *',
        [type, content]
      );
      return NextResponse.json(res.rows[0]);
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
