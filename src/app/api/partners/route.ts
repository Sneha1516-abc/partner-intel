import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = getDb();
        const partners = db.prepare('SELECT * FROM partners ORDER BY createdAt DESC').all();
        return NextResponse.json({ success: true, partners });
    } catch (error) {
        console.error('Error fetching partners:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch partners' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, url, category, ecosystemContext, overview, strategy, synergy, gtmStrategy } = body;

        if (!name || !strategy) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const db = getDb();
        const stmt = db.prepare(
            'INSERT INTO partners (name, url, category, ecosystemContext, overview, strategy, synergy, gtmStrategy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        const result = stmt.run(name, url || '', category || '', ecosystemContext || '', overview || '', strategy, synergy || '', gtmStrategy || '');

        return NextResponse.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        console.error('Error saving partner:', error);
        return NextResponse.json({ success: false, error: 'Failed to save partner' }, { status: 500 });
    }
}
