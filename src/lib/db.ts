import Database from 'better-sqlite3';
import path from 'path';

// Connect to or create a local SQLite database file
const dbPath = path.resolve(process.cwd(), 'partner-intel.db');

let db: ReturnType<typeof Database> | null = null;

export function getDb() {
  if (!db) {
    db = new Database(dbPath);

    // Initialize tables if they don't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS partners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT,
        category TEXT,
        ecosystemContext TEXT,
        strategy TEXT NOT NULL,
        synergy TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Gracefully add new columns to existing databases
    try { db.exec('ALTER TABLE partners ADD COLUMN category TEXT'); } catch (e) { }
    try { db.exec('ALTER TABLE partners ADD COLUMN ecosystemContext TEXT'); } catch (e) { }
  }
  return db;
}
