const express = require('express');
const cors = require('cors');
const db = require('./db/init');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ============ LEAGUE ENDPOINTS ============

// Get all leagues
app.get('/api/leagues', (req, res) => {
  db.all('SELECT * FROM leagues', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create a new league
app.post('/api/leagues', (req, res) => {
  const { name } = req.body;
  const id = uuidv4();

  db.run(
    'INSERT INTO leagues (id, name) VALUES (?, ?)',
    [id, name],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, name });
    }
  );
});

// Get league with teams
app.get('/api/leagues/:leagueId', (req, res) => {
  const { leagueId } = req.params;

  db.get('SELECT * FROM leagues WHERE id = ?', [leagueId], (err, league) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!league) {
      res.status(404).json({ error: 'League not found' });
      return;
    }

    // Get all teams for this league
    db.all(
      'SELECT * FROM teams WHERE leagueId = ? ORDER BY totalPoints DESC',
      [leagueId],
      (err, teams) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        // Get players for each team
        Promise.all(
          teams.map(
            team =>
              new Promise((resolve, reject) => {
                db.all(
                  'SELECT * FROM players WHERE teamId = ?',
                  [team.id],
                  (err, players) => {
                    if (err) reject(err);
                    resolve({ ...team, players });
                  }
                );
              })
          )
        )
          .then(teamsWithPlayers => {
            res.json({ ...league, teams: teamsWithPlayers });
          })
          .catch(err => {
            res.status(500).json({ error: err.message });
          });
      }
    );
  });
});

// ============ TEAM ENDPOINTS ============

// Create a new team
app.post('/api/teams', (req, res) => {
  const { leagueId, name, owner } = req.body;
  const id = uuidv4();

  db.run(
    'INSERT INTO teams (id, leagueId, name, owner) VALUES (?, ?, ?, ?)',
    [id, leagueId, name, owner],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, leagueId, name, owner, totalPoints: 0, players: [] });
    }
  );
});

// Get all teams in a league
app.get('/api/leagues/:leagueId/teams', (req, res) => {
  const { leagueId } = req.params;

  db.all(
    'SELECT * FROM teams WHERE leagueId = ? ORDER BY totalPoints DESC',
    [leagueId],
    (err, teams) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(teams);
    }
  );
});

// ============ PLAYER ENDPOINTS ============

// Get available players (not drafted)
app.get('/api/available-players', (req, res) => {
  db.all(
    'SELECT * FROM players WHERE isAvailable = 1 AND teamId IS NULL ORDER BY seed ASC',
    [],
    (err, players) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(players);
    }
  );
});

// Add player to team (draft)
app.post('/api/players/:playerId/assign', (req, res) => {
  const { playerId } = req.params;
  const { teamId } = req.body;

  db.run(
    'UPDATE players SET teamId = ?, isAvailable = 0 WHERE id = ?',
    [teamId, playerId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, playerId, teamId });
    }
  );
});

// Get players on a team
app.get('/api/teams/:teamId/players', (req, res) => {
  const { teamId } = req.params;

  db.all(
    'SELECT * FROM players WHERE teamId = ?',
    [teamId],
    (err, players) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(players);
    }
  );
});

// Create a player pool
app.post('/api/players/pool', (req, res) => {
  const { playerList } = req.body; // Array of player objects

  const insertPlayers = playerList.map(player => {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      db.run(
        'INSERT INTO players (id, name, ncaaTeam, seed, isAvailable) VALUES (?, ?, ?, ?, 1)',
        [id, player.name, player.ncaaTeam, player.seed || 0],
        function(err) {
          if (err) reject(err);
          resolve({ id, ...player });
        }
      );
    });
  });

  Promise.all(insertPlayers)
    .then(players => {
      res.status(201).json({ created: players.length, players });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// ============ SCORING ENDPOINTS ============

// Simulate a game for a player
app.post('/api/players/:playerId/game', (req, res) => {
  const { playerId } = req.params;
  const { opponent, pointsScored } = req.body;
  const gameId = uuidv4();

  db.run(
    'BEGIN TRANSACTION',
    err => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Insert game
      db.run(
        'INSERT INTO games (id, playerId, pointsScored, opponent) VALUES (?, ?, ?, ?)',
        [gameId, playerId, pointsScored, opponent],
        err => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          // Update player total points and games played
          db.run(
            'UPDATE players SET totalPoints = totalPoints + ?, gamesPlayed = gamesPlayed + 1 WHERE id = ?',
            [pointsScored, playerId],
            err => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }

              // Get the player's team
              db.get(
                'SELECT teamId FROM players WHERE id = ?',
                [playerId],
                (err, player) => {
                  if (err || !player.teamId) {
                    res.status(500).json({ error: 'Player not on a team' });
                    return;
                  }

                  // Update team total points
                  db.run(
                    'UPDATE teams SET totalPoints = (SELECT SUM(totalPoints) FROM players WHERE teamId = ?) WHERE id = ?',
                    [player.teamId, player.teamId],
                    err => {
                      if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                      }

                      db.run('COMMIT', err => {
                        if (err) {
                          res.status(500).json({ error: err.message });
                          return;
                        }
                        res.status(201).json({
                          gameId,
                          playerId,
                          pointsScored,
                          opponent
                        });
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

// Eliminate a player
app.post('/api/players/:playerId/eliminate', (req, res) => {
  const { playerId } = req.params;

  db.run(
    'UPDATE players SET isEliminated = 1 WHERE id = ?',
    [playerId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, playerId });
    }
  );
});

// ============ RESET ENDPOINTS ============

// Reset all data (for testing)
app.post('/api/reset', (req, res) => {
  db.serialize(() => {
    db.run('DELETE FROM games');
    db.run('DELETE FROM players');
    db.run('DELETE FROM teams');
    db.run('DELETE FROM leagues', err => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, message: 'All data reset' });
    });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Fantasy MM Backend running on http://localhost:${PORT}`);
});
