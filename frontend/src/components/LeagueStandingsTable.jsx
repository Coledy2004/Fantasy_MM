import React from 'react';

export default function LeagueStandingsTable({ teams, onTeamClick }) {
  return (
    <div className="mm-card overflow-hidden">
      <div className="bg-gradient-to-r from-mm-navy to-mm-blue p-6">
        <h2 className="text-2xl font-bold text-white">League Standings</h2>
        <p className="text-mm-sky text-sm mt-1">Regular Season</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-mm-border bg-mm-light">
              <th className="px-6 py-4 text-left text-sm font-bold text-mm-text">RANK</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-mm-text">TEAM</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-mm-text">OWNER</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-mm-text">PLAYERS</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-mm-text">POINTS</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-mm-text">TREND</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, idx) => (
              <tr
                key={team.id}
                className="border-b border-mm-border hover:bg-mm-light transition-colors cursor-pointer"
                onClick={() => onTeamClick && onTeamClick(team)}
              >
                <td className="px-6 py-4">
                  <span className="mm-rank-badge">{idx + 1}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-white text-base">{team.teamName}</p>
                  <p className="text-xs text-mm-text">{team.playerCount} players</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-mm-text">{team.owner}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-mm-sky bg-opacity-20 text-mm-sky px-3 py-1 rounded-full text-sm font-semibold">
                    {team.activePlayerCount}/{team.playerCount}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <p className="text-2xl font-bold text-mm-sky">{team.totalPoints}</p>
                  <p className="text-xs text-mm-text mt-1">{team.pointsPerGame.toFixed(2)} avg</p>
                </td>
                <td className="px-6 py-4 text-center">
                  {team.trend > 0 ? (
                    <span className="text-mm-success font-bold">↑ {team.trend}</span>
                  ) : team.trend < 0 ? (
                    <span className="text-mm-warning font-bold">↓ {Math.abs(team.trend)}</span>
                  ) : (
                    <span className="text-gray-400">→</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
