import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
    try {
        // Ensure table exists on first run
        await sql`
            CREATE TABLE IF NOT EXISTS partners (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                url TEXT,
                category VARCHAR(255),
                "ecosystemContext" TEXT,
                overview TEXT,
                strategy TEXT NOT NULL,
                synergy TEXT,
                "gtmStrategy" TEXT,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        const { rows } = await sql`SELECT * FROM partners ORDER BY "createdAt" DESC`;
        return NextResponse.json({ success: true, partners: rows });
    } catch (error) {
        console.error('Error fetching partners (Vercel Postgres):', error);
        return NextResponse.json({ success: false, error: 'Database error. Make sure Postgres is provisioned in Vercel.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, url, category, ecosystemContext, overview, strategy, synergy, gtmStrategy } = body;

        if (!name || !strategy) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Just in case GET wasn't called first
        await sql`
            CREATE TABLE IF NOT EXISTS partners (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                url TEXT,
                category VARCHAR(255),
                "ecosystemContext" TEXT,
                overview TEXT,
                strategy TEXT NOT NULL,
                synergy TEXT,
                "gtmStrategy" TEXT,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        const result = await sql`
            INSERT INTO partners (name, url, category, "ecosystemContext", overview, strategy, synergy, "gtmStrategy")
            VALUES (${name}, ${url || ''}, ${category || ''}, ${ecosystemContext || ''}, ${overview || ''}, ${strategy}, ${synergy || ''}, ${gtmStrategy || ''})
            RETURNING id
        `;

        return NextResponse.json({ success: true, id: result.rows[0].id });
    } catch (error: any) {
        console.error('Error saving partner (Vercel Postgres):', error);
        return NextResponse.json({ success: false, error: 'Database saving error. Make sure Postgres is provisioned in Vercel.' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Missing partner ID' }, { status: 400 });
        }

        await sql`DELETE FROM partners WHERE id = ${id}`;

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        console.error('Error deleting partner:', error);
        return NextResponse.json({ success: false, error: 'Database deletion error.' }, { status: 500 });
    }
}
