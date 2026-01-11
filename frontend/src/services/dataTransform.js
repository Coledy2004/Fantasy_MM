import { getMariadiMadnessGames, getGameBoxScore, getTeamRankings } from './ncaaApi';

/**
 * Transform NCAA API game data to our player card format
 */
export async function transformGameDataToPlayers(gameId) {
  const boxScore = await getGameBoxScore(gameId);
  if (!boxScore) return [];

  // Extract player stats from box score
  const players = [];
  
  if (boxScore.teams) {
    boxScore.teams.forEach(team => {
      if (team.players) {
        team.players.forEach(player => {
          players.push({
            id: player.id || Math.random(),
            name: player.name || 'Unknown',
            ncaaTeam: team.name || 'Unknown',
            seed: player.seed || 0,
            totalPoints: parseInt(player.points) || 0,
            gamesPlayed: 1,
            isEliminated: false,
            recentGames: [
              {
                points: parseInt(player.points) || 0,
                opponent: 'Tournament'
              }
            ]
          });
        });
      }
    });
  }

  return players;
}

/**
 * Get all tournament games for a specific date
 */
export async function getTournamentGamesForDate(year, month, day) {
  const gamesData = await getMariadiMadnessGames(year, month, day);
  if (!gamesData || !gamesData.games) return [];

  return gamesData.games.map(game => ({
    id: game.game?.gameID || Math.random(),
    awayTeam: game.game?.away?.names?.full || 'Unknown',
    homeTeam: game.game?.home?.names?.full || 'Unknown',
    awayScore: parseInt(game.game?.away?.score) || 0,
    homeScore: parseInt(game.game?.home?.score) || 0,
    awayRank: game.game?.away?.rank || '',
    homeRank: game.game?.home?.rank || '',
    awaySeed: game.game?.away?.seed || '',
    homeSeed: game.game?.home?.seed || '',
    gameTime: game.game?.startTime || 'TBA',
    status: game.game?.gameState || 'scheduled',
    finalMessage: game.game?.finalMessage || ''
  }));
}

/**
 * Get team rankings and convert to league standings format
 */
export async function getLeagueStandingsFromRankings() {
  const rankings = await getTeamRankings();
  if (!rankings || !rankings.data) return [];

  return rankings.data.slice(0, 25).map((rank, idx) => ({
    id: idx + 1,
    teamName: rank.SCHOOL || 'Unknown',
    owner: 'System',
    totalPoints: parseInt(rank.POINTS) || 0,
    playerCount: 10,
    activePlayerCount: 10,
    pointsPerGame: (parseInt(rank.POINTS) || 0) / 10,
    trend: 0,
    rank: parseInt(rank.RANK) || idx + 1,
    record: rank.RECORD || '0-0'
  }));
}

/**
 * Mock tournament data generation (fallback if API is down)
 */
export function generateMockTournamentData() {
  const mockSeeds = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3];
  const mockTeams = [
    'Duke', 'Kansas', 'North Carolina', 'Arizona',
    'Kentucky', 'Texas Tech', 'Gonzaga', 'Purdue',
    'Houston', 'Alabama'
  ];
  const mockPlayers = [
    'LeBron James', 'Paolo Banchero', 'Cole Anthony',
    'Scottie Barnes', 'Tyrese Maxey', 'Devin Vassell',
    'Immanuel Quickley', 'Tyus Washington Jr', 'MJ Walker',
    'AJ Dillon'
  ];

  return mockPlayers.map((name, idx) => ({
    id: idx + 1,
    name,
    ncaaTeam: mockTeams[idx],
    seed: mockSeeds[idx],
    totalPoints: Math.floor(Math.random() * 50),
    gamesPlayed: Math.floor(Math.random() * 4) + 1,
    isEliminated: Math.random() > 0.6,
    recentGames: [
      { points: Math.floor(Math.random() * 25), opponent: 'Team A' },
      { points: Math.floor(Math.random() * 25), opponent: 'Team B' }
    ]
  }));
}

/**
 * Calculate player points based on NCAA performance
 * Simplified scoring system for fantasy
 */
export function calculateFantasyScore(player, gameStats) {
  let score = 0;

  // Points: 1 point per point scored
  score += (gameStats.points || 0);

  // Rebounds: 1.2 points per rebound
  score += (gameStats.rebounds || 0) * 1.2;

  // Assists: 1.5 points per assist
  score += (gameStats.assists || 0) * 1.5;

  // Steals: 3 points per steal
  score += (gameStats.steals || 0) * 3;

  // Blocks: 3 points per block
  score += (gameStats.blocks || 0) * 3;

  // Turnovers: -1 point per turnover
  score -= (gameStats.turnovers || 0);

  return Math.round(score);
}
