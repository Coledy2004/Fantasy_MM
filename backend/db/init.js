const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'fantasy_mm.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Initialize tables
db.serialize(() => {
  // Leagues table
  db.run(`
    CREATE TABLE IF NOT EXISTS leagues (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Teams table
  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      leagueId TEXT NOT NULL,
      name TEXT NOT NULL,
      owner TEXT NOT NULL,
      totalPoints INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(leagueId) REFERENCES leagues(id)
    )
  `);

  // Players table
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      teamId TEXT,
      name TEXT NOT NULL,
      ncaaTeam TEXT NOT NULL,
      seed INTEGER,
      totalPoints INTEGER DEFAULT 0,
      gamesPlayed INTEGER DEFAULT 0,
      isEliminated BOOLEAN DEFAULT 0,
      isAvailable BOOLEAN DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(teamId) REFERENCES teams(id)
    )
  `);

  // Games table (for simulations)
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      playerId TEXT NOT NULL,
      pointsScored INTEGER NOT NULL,
      opponent TEXT NOT NULL,
      gameDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(playerId) REFERENCES players(id)
    )
  `);
});

module.exports = db;
