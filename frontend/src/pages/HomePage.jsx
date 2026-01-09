import React, { useState } from 'react';
import PlayerCard from '../components/PlayerCard';
import LeagueStandingsTable from '../components/LeagueStandingsTable';
import StatBox from '../components/StatBox';

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

  const activePlayers = mockMyTeam.players.filter(p => !p.isEliminated).length;
  const averagePointsPerPlayer = mockMyTeam.totalPoints / mockMyTeam.players.length;

  return (
    <div className="min-h-screen bg-mm-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="mm-heading-1 mb-2">Welcome Back!</h1>
          <p className="text-gray-600 text-lg">Here's your fantasy March Madness dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatBox
            label="Your Points"
            value={mockMyTeam.totalPoints}
            icon="🏀"
            trend={5}
            trendLabel="Last 3 games"
          />
          <StatBox
            label="Active Players"
            value={activePlayers}
            icon="👥"
            trendLabel={`${mockMyTeam.players.length - activePlayers} eliminated`}
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
              <h2 className="mm-heading-2 mb-4">Your Roster - {mockMyTeam.teamName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockMyTeam.players.map(player => (
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
                <div className="pb-4 border-b border-mm-light">
                  <p className="text-xs text-gray-500 font-semibold mb-1">TOTAL POINTS</p>
                  <p className="text-3xl font-bold text-mm-blue">{mockMyTeam.totalPoints}</p>
                </div>
                <div className="pb-4 border-b border-mm-light">
                  <p className="text-xs text-gray-500 font-semibold mb-1">ACTIVE PLAYERS</p>
                  <p className="text-2xl font-bold text-mm-success">{activePlayers}/10</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">SEED DISTRIBUTION</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Seeds 1-6</span>
                      <span className="font-bold text-mm-blue">7</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Seeds 7-10</span>
                      <span className="font-bold text-mm-blue">2</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Seeds 11-16</span>
                      <span className="font-bold text-mm-blue">1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mm-card p-6">
              <h3 className="mm-heading-3 mb-4">League Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">LEAGUE</p>
                  <p className="text-lg font-bold text-mm-navy">2026 Elite Eight</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">MEMBERS</p>
                  <p className="text-lg font-bold text-mm-navy">4 Teams</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">YOUR RANK</p>
                  <p className="text-2xl font-bold text-mm-gold">1st Place 🥇</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <LeagueStandingsTable
          teams={mockLeagueTeams}
          onTeamClick={setSelectedTeam}
        />
      </div>
    </div>
  );
}
