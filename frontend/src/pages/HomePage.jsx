import React, { useState, useEffect } from 'react';
import PlayerCard from '../components/PlayerCard';
import LeagueStandingsTable from '../components/LeagueStandingsTable';
import StatBox from '../components/StatBox';
import { getLeagueStandingsFromRankings, getTournamentGamesForDate } from '../services/dataTransform';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Initial mock team - will be replaced with real data
const mockMyTeam = {
  teamName: 'Bracket Busters',
  owner: 'Cole D',
  totalPoints: 245,
  players: [
    {
      id: 1,
      name: 'LeBron James',
      ncaaTeam: 'Duke',
      seed: 1,
      totalPoints: 45,
      gamesPlayed: 3,
      isEliminated: false,
      recentGames: [
        { points: 15, opponent: 'Vermont' },
        { points: 18, opponent: 'UCLA' },
        { points: 12, opponent: 'Kentucky' },
      ],
    },
    {
      id: 2,
      name: 'Paolo Banchero',
      ncaaTeam: 'Kansas',
      seed: 1,
      totalPoints: 38,
      gamesPlayed: 3,
      isEliminated: false,
      recentGames: [
        { points: 12, opponent: 'Howard' },
        { points: 14, opponent: 'Providence' },
        { points: 12, opponent: 'Miami' },
      ],
    },
    {
      id: 3,
      name: 'Cole Anthony',
      ncaaTeam: 'North Carolina',
      seed: 2,
      totalPoints: 32,
      gamesPlayed: 3,
      isEliminated: false,
      recentGames: [
        { points: 11, opponent: 'Wisconsin' },
        { points: 10, opponent: 'Stanford' },
        { points: 11, opponent: 'Duke' },
      ],
    },
    {
      id: 4,
      name: 'Scottie Barnes',
      ncaaTeam: 'Arizona',
      seed: 2,
      totalPoints: 28,
      gamesPlayed: 2,
      isEliminated: true,
      recentGames: [
        { points: 14, opponent: 'Wichita State' },
        { points: 14, opponent: 'Houston' },
      ],
    },
    {
      id: 5,
      name: 'Tyrese Maxey',
      ncaaTeam: 'Kentucky',
      seed: 2,
      totalPoints: 35,
      gamesPlayed: 3,
      isEliminated: false,
      recentGames: [
        { points: 12, opponent: 'Abilene Christian' },
        { points: 11, opponent: 'LSU' },
        { points: 12, opponent: 'Duke' },
      ],
    },
    {
      id: 6,
      name: 'Devin Vassell',
      ncaaTeam: 'Texas Tech',
      seed: 3,
      totalPoints: 25,
      gamesPlayed: 2,
      isEliminated: true,
      recentGames: [
        { points: 13, opponent: 'Utah State' },
        { points: 12, opponent: 'Michigan' },
      ],
    },
    {
      id: 7,
      name: 'Immanuel Quickley',
      ncaaTeam: 'Kentucky',
      seed: 2,
      totalPoints: 42,
      gamesPlayed: 3,
      isEliminated: false,
      recentGames: [
        { points: 14, opponent: 'Abilene Christian' },
        { points: 14, opponent: 'LSU' },
        { points: 14, opponent: 'Duke' },
      ],
    },
    {
      id: 8,
      name: 'Tyus Washington Jr',
      ncaaTeam: 'Oregon State',
      seed: 8,
      totalPoints: 18,
      gamesPlayed: 2,
      isEliminated: true,
      recentGames: [
        { points: 9, opponent: '13 Seed' },
        { points: 9, opponent: 'Colorado' },
      ],
    },
    {
      id: 9,
      name: 'MJ Walker',
      ncaaTeam: 'FSU',
      seed: 4,
      totalPoints: 22,
      gamesPlayed: 1,
      isEliminated: true,
      recentGames: [
        { points: 22, opponent: 'UNC Greensboro' },
      ],
    },
    {
      id: 10,
      name: 'AJ Dillon',
      ncaaTeam: 'Boston College',
      seed: 12,
      totalPoints: 8,
      gamesPlayed: 1,
      isEliminated: true,
      recentGames: [
        { points: 8, opponent: 'Duke' },
      ],
    },
  ],
};

const mockLeagueTeams = [
  {
    id: 1,
    teamName: 'Bracket Busters',
    owner: 'Cole D',
    totalPoints: 245,
    playerCount: 10,
    activePlayerCount: 6,
    pointsPerGame: 23.4,
    trend: 2,
  },
  {
    id: 2,
    teamName: 'Cinderella Dreams',
    owner: 'Sarah M',
    totalPoints: 238,
    playerCount: 10,
    activePlayerCount: 7,
    pointsPerGame: 22.8,
    trend: -1,
  },
  {
    id: 3,
    teamName: 'Final Four Picks',
    owner: 'Mike J',
    totalPoints: 221,
    playerCount: 10,
    activePlayerCount: 5,
    pointsPerGame: 21.1,
    trend: 0,
  },
  {
    id: 4,
    teamName: 'Sweet Sixteen',
    owner: 'Jessica H',
    totalPoints: 198,
    playerCount: 10,
    activePlayerCount: 4,
    pointsPerGame: 18.9,
    trend: -3,
  },
];

export default function HomePage() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [leagueTeams, setLeagueTeams] = useState(mockLeagueTeams);
  const [myTeam, setMyTeam] = useState(mockMyTeam);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real tournament data on component mount
  useEffect(() => {
    async function fetchTournamentData() {
      try {
        setLoading(true);
        // If a league is selected, load that league from backend
        const selectedLeagueId = localStorage.getItem('selectedLeagueId');
        if (selectedLeagueId) {
          try {
            const resp = await fetch(`${API_URL}/api/leagues/${selectedLeagueId}`);
            if (resp.ok) {
              const leagueData = await resp.json();
              // map backend teams to UI shape
              const mapped = leagueData.teams.map(t => {
                const playerCount = (t.players && t.players.length) || 0;
                const activePlayerCount = (t.players && t.players.filter(p => !p.isEliminated).length) || 0;
                const points = t.totalPoints || 0;
                return {
                  id: t.id,
                  teamName: t.name,
                  owner: t.owner,
                  totalPoints: points,
                  playerCount,
                  activePlayerCount,
                  pointsPerGame: playerCount ? points / playerCount : 0,
                  trend: 0
                };
              });
              setLeagueTeams(mapped);
              // set myTeam to first team in league if present
              if (leagueData.teams && leagueData.teams.length > 0) {
                const t = leagueData.teams[0];
                const myTeamObj = {
                  teamName: t.name,
                  owner: t.owner,
                  totalPoints: t.totalPoints || 0,
                  players: (t.players || []).map((p, idx) => ({
                    id: p.id || idx,
                    name: p.name,
                    ncaaTeam: p.ncaaTeam,
                    seed: p.seed,
                    totalPoints: p.totalPoints || 0,
                    gamesPlayed: p.gamesPlayed || 0,
                    isEliminated: !!p.isEliminated,
                    recentGames: []
                  }))
                };
                setMyTeam(myTeamObj);
              }
            } else {
              console.warn('Failed to load selected league from backend, falling back to live NCAA data');
            }
          } catch (e) {
            console.warn('Error fetching league from backend', e);
          }
        }

        // Fetch standings/rankings from NCAA API as supplemental data
        const standings = await getLeagueStandingsFromRankings();
        if (standings && standings.length > 0) {
          // Use top 25 teams as league standings only if no backend league was selected
          if (!localStorage.getItem('selectedLeagueId')) {
            setLeagueTeams(standings.slice(0, 25));
          }
          console.log('✅ Loaded real NCAA tournament standings from NCAA API', standings);
        } else {
          if (!localStorage.getItem('selectedLeagueId')) setLeagueTeams(mockLeagueTeams);
          console.warn('⚠️ Using mock data - NCAA API may be unavailable');
        }

        // Fetch tournament games for current date to get real player data
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        
        const games = await getTournamentGamesForDate(year, month, day);
        if (games && games.length > 0) {
          console.log('✅ Loaded real tournament games for date:', `${year}/${month}/${day}`, games);
          // Create player data from games
          const players = games.slice(0, 10).map((game, idx) => ({
            id: idx + 1,
            name: `${game.awayTeam} vs ${game.homeTeam}`,
            ncaaTeam: game.awayTeam,
            seed: parseInt(game.awaySeed) || 0,
            totalPoints: game.awayScore,
            gamesPlayed: 1,
            isEliminated: game.awayScore < game.homeScore,
            recentGames: [
              { points: game.awayScore, opponent: game.homeTeam }
            ],
          }));
          
          if (players.length > 0) {
            const totalPoints = players.reduce((sum, p) => sum + p.totalPoints, 0);
            const updatedTeam = {
              ...mockMyTeam,
              players: players,
              totalPoints: totalPoints
            };
            setMyTeam(updatedTeam);
            console.log('✅ Updated team with real game data');
          }
        } else {
          console.warn('⚠️ No games found for today, using mock player data');
          setMyTeam(mockMyTeam);
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching tournament data:', err);
        setError(err.message);
        setLeagueTeams(mockLeagueTeams);
        setMyTeam(mockMyTeam);
        setLoading(false);
      }
    }

    fetchTournamentData();
  }, []);

  // Calculate active players and average points
  const activePlayers = myTeam.players.filter(p => !p.isEliminated).length;
  const averagePointsPerPlayer = myTeam.totalPoints / myTeam.players.length;

  return (
    <div className="min-h-screen bg-mm-dark py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="mm-heading-1 mb-2">Welcome Back!</h1>
          <p className="text-mm-text text-lg">Here's your fantasy March Madness dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatBox
            label="Your Points"
            value={myTeam.totalPoints}
            icon="🏀"
            trend={5}
            trendLabel="Last 3 games"
          />
          <StatBox
            label="Active Players"
            value={activePlayers}
            icon="👥"
            trendLabel={`${myTeam.players.length - activePlayers} eliminated`}
          />
          <StatBox
            label="Avg Per Player"
            value={Math.round(averagePointsPerPlayer)}
            icon="📊"
            trend={2}
            trendLabel="Per tournament game"
          />
          <StatBox
            label="League Rank"
            value="1st"
            icon="🥇"
            trend={0}
            trendLabel="Leading the league"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="mm-heading-2 mb-4">Your Roster - {myTeam.teamName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myTeam.players.map(player => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    isEliminated={player.isEliminated}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="mm-card p-6 mb-6">
              <h3 className="mm-heading-3 mb-4">Your Team Stats</h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-mm-border">
                  <p className="text-xs text-mm-text font-semibold mb-1">TOTAL POINTS</p>
                  <p className="text-3xl font-bold text-mm-sky">{myTeam.totalPoints}</p>
                </div>
                <div className="pb-4 border-b border-mm-border">
                  <p className="text-xs text-mm-text font-semibold mb-1">ACTIVE PLAYERS</p>
                  <p className="text-2xl font-bold text-mm-success">{activePlayers}/{myTeam.players.length}</p>
                </div>
                <div>
                  <p className="text-xs text-mm-text font-semibold mb-1">SEED DISTRIBUTION</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-mm-text">
                      <span>Seeds 1-6</span>
                      <span className="font-bold text-mm-sky">7</span>
                    </div>
                    <div className="flex justify-between text-sm text-mm-text">
                      <span>Seeds 7-10</span>
                      <span className="font-bold text-mm-sky">2</span>
                    </div>
                    <div className="flex justify-between text-sm text-mm-text">
                      <span>Seeds 11-16</span>
                      <span className="font-bold text-mm-sky">1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mm-card p-6">
              <h3 className="mm-heading-3 mb-4">League Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-mm-text font-semibold">LEAGUE</p>
                  <p className="text-lg font-bold text-white">2026 Elite Eight</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">MEMBERS</p>
                  <p className="text-lg font-bold text-mm-navy">{leagueTeams.length} Teams</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">DATA SOURCE</p>
                  <p className="text-sm font-bold text-mm-navy">🔗 NCAA API (Live)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <LeagueStandingsTable
          teams={leagueTeams}
          onTeamClick={setSelectedTeam}
        />
      </div>
    </div>
  );
}
