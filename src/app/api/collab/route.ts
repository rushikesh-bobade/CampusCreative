import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a pool using the DATABASE_URL
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
      // Fetch teams and member count
      const res = await client.query(`
        SELECT t.id, t.name, t.created_at, COUNT(m.id)::int as member_count
        FROM teams t
        LEFT JOIN members m ON t.id = m.team_id
        GROUP BY t.id
        ORDER BY t.created_at DESC
      `);
      return NextResponse.json(res.rows);
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Database fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { action, ...data } = await req.json();
    const client = await pool.connect();
    
    try {
      if (action === 'createTeam') {
        const { name } = data;
        const res = await client.query(
          'INSERT INTO teams (name) VALUES ($1) RETURNING *',
          [name]
        );
        const team = res.rows[0];
        
        // Add creator as member
        await client.query(
          'INSERT INTO members (team_id, name, role) VALUES ($1, $2, $3)',
          [team.id, 'Admin User', 'Owner']
        );
        
        return NextResponse.json(team);
      } else if (action === 'addMember') {
        const { teamId, name, role } = data;
        const res = await client.query(
          'INSERT INTO members (team_id, name, role) VALUES ($1, $2, $3) RETURNING *',
          [teamId, name, role || 'Member']
        );
        return NextResponse.json(res.rows[0]);
      } else if (action === 'deleteTeam') {
        const { id } = data;
        await client.query('DELETE FROM teams WHERE id = $1', [id]);
        return NextResponse.json({ success: true });
      } else if (action === 'fetchActivity') {
        const res = await client.query(
          'SELECT * FROM generations ORDER BY created_at DESC LIMIT 5'
        );
        return NextResponse.json(res.rows);
      }
      
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Database operation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
