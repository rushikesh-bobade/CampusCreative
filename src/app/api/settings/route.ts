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
      const res = await client.query('SELECT * FROM settings LIMIT 1');
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
      const { campus_name, theme, notifications_enabled } = data;
      
      const existing = await client.query('SELECT id FROM settings LIMIT 1');
      
      if (existing.rows.length > 0) {
        await client.query(
          'UPDATE settings SET campus_name = $1, theme = $2, notifications_enabled = $3, updated_at = NOW() WHERE id = $4',
          [campus_name, theme, notifications_enabled, existing.rows[0].id]
        );
      } else {
        await client.query(
          'INSERT INTO settings (campus_name, theme, notifications_enabled) VALUES ($1, $2, $3)',
          [campus_name, theme, notifications_enabled]
        );
      }
      
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
