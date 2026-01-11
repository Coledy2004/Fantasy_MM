import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AllTeamsPage() {
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [sortBy, setSortBy] = useState('points');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selectedLeagueId = localStorage.getItem('selectedLeagueId');
    if (selectedLeagueId) {
      fetch(`${API_URL}/api/leagues/${selectedLeagueId}`)
        .then(r => r.json())
        .then(data => {
          if (data && data.teams) {
            const mapped = data.teams.map(t => {
              const players = (t.players || []).map(p => ({
                name: p.name,
                team: p.ncaaTeam,
                seed: p.seed,
                points: p.totalPoints || 0,
                status: p.isEliminated ? 'eliminated' : 'active'
              }));
              const playerCount = players.length;
              const activePlayerCount = players.filter(p => p.status === 'active').length;
              const seedDistribution = { '1-6': 0, '7-10': 0, '11-16': 0 };
              players.forEach(p => {
                if (p.seed >= 1 && p.seed <= 6) seedDistribution['1-6']++;
                else if (p.seed >= 7 && p.seed <= 10) seedDistribution['7-10']++;
                else seedDistribution['11-16']++;
              });

              return {
                id: t.id,
                teamName: t.name,
                owner: t.owner,
                totalPoints: t.totalPoints || 0,
                playerCount,
                activePlayerCount,
                pointsPerGame: playerCount ? (t.totalPoints || 0) / playerCount : 0,
                trend: 0,
                lastUpdated: 'now',
                seedDistribution,
                players
              };
            });
            setTeams(mapped);
          }
        })
        .catch(err => console.error('Error loading league teams', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const sortedTeams = [...teams].sort((a, b) => {
    if (sortBy === 'points') return b.totalPoints - a.totalPoints;
    if (sortBy === 'name') return a.teamName.localeCompare(b.teamName);
    if (sortBy === 'active') return b.activePlayerCount - a.activePlayerCount;
    return 0;
  });

  const toggleTeamExpansion = (teamId) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  return (
    <div className="min-h-screen bg-mm-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mm-heading-1 mb-2">All Teams</h1>
          <p className="text-gray-600 text-lg">View all team scores and rosters</p>
        </div>

        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setSortBy('points')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'points'
                ? 'bg-mm-blue text-white'
                : 'bg-white text-mm-blue border border-mm-blue hover:bg-mm-light'
            }`}
          >
            Sort by Points
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'name'
                ? 'bg-mm-blue text-white'
                : 'bg-white text-mm-blue border border-mm-blue hover:bg-mm-light'
            }`}
          >
            Sort by Name
          </button>
          <button
            onClick={() => setSortBy('active')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'active'
                ? 'bg-mm-blue text-white'
                : 'bg-white text-mm-blue border border-mm-blue hover:bg-mm-light'
            }`}
          >
            Sort by Active Players
          </button>
        </div>

        <div className="space-y-6">
          {sortedTeams.map((team, idx) => (
            <div key={team.id} className="mm-card overflow-hidden">
              <div
                onClick={() => toggleTeamExpansion(team.id)}
                className="bg-gradient-to-r from-mm-navy to-mm-blue p-6 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-mm-gold rounded-lg text-mm-navy font-bold text-xl">
                      #{idx + 1}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{team.teamName}</h2>
                      <p className="text-mm-sky text-sm">Owner: {team.owner}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-mm-gold text-sm font-semibold">TOTAL POINTS</p>
                    <p className="text-4xl font-bold text-white">{team.totalPoints}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-mm-blue border-opacity-30">
                  <div className="text-center">
                    <p className="text-mm-light text-xs font-semibold mb-1">ACTIVE PLAYERS</p>
                    <p className="text-2xl font-bold text-mm-gold">
                      {team.activePlayerCount}/{team.playerCount}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-mm-light text-xs font-semibold mb-1">AVG PER GAME</p>
                    <p className="text-2xl font-bold text-mm-gold">{team.pointsPerGame.toFixed(1)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-mm-light text-xs font-semibold mb-1">TREND</p>
                    <p className={`text-2xl font-bold ${team.trend > 0 ? 'text-mm-success' : team.trend < 0 ? 'text-mm-warning' : 'text-mm-light'}`}>
                      {team.trend > 0 ? '↑' : team.trend < 0 ? '↓' : '→'} {Math.abs(team.trend)}
                    </p>
                  </div>
                </div>
              </div>

              {expandedTeam === team.id && (
                <div className="bg-white p-6">
                  <div className="mb-8 pb-8 border-b border-mm-light">
                    <h3 className="mm-heading-3 mb-4">Seed Distribution</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-mm-light p-4 rounded-lg text-center">
                        <p className="text-sm font-semibold text-gray-600 mb-2">Seeds 1-6</p>
                        <p className="text-3xl font-bold text-mm-blue">{team.seedDistribution['1-6']}</p>
                      </div>
                      <div className="bg-mm-light p-4 rounded-lg text-center">
                        <p className="text-sm font-semibold text-gray-600 mb-2">Seeds 7-10</p>
                        <p className="text-3xl font-bold text-mm-blue">{team.seedDistribution['7-10']}</p>
                      </div>
                      <div className="bg-mm-light p-4 rounded-lg text-center">
                        <p className="text-sm font-semibold text-gray-600 mb-2">Seeds 11-16</p>
                        <p className="text-3xl font-bold text-mm-blue">{team.seedDistribution['11-16']}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mm-heading-3 mb-4">Roster</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-mm-border bg-mm-light">
                            <th className="px-4 py-3 text-left text-sm font-bold text-mm-navy">PLAYER</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-mm-navy">NCAA TEAM</th>
                            <th className="px-4 py-3 text-center text-sm font-bold text-mm-navy">SEED</th>
                            <th className="px-4 py-3 text-right text-sm font-bold text-mm-navy">POINTS</th>
                            <th className="px-4 py-3 text-center text-sm font-bold text-mm-navy">STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {team.players.map((player, pidx) => (
                            <tr key={pidx} className="border-b border-mm-light hover:bg-mm-light transition-colors">
                              <td className="px-4 py-3 font-semibold text-mm-navy">{player.name}</td>
                              <td className="px-4 py-3 text-gray-600">{player.team}</td>
                              <td className="px-4 py-3 text-center">
                                <span className="inline-block px-3 py-1 rounded-full bg-mm-sky bg-opacity-20 text-mm-navy font-bold text-sm">
                                  {player.seed}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="text-lg font-bold text-mm-blue">{player.points}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {player.status === 'active' ? (
                                  <span className="mm-points-badge">Active</span>
                                ) : (
                                  <span className="mm-eliminated-badge">Eliminated</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-4">Last updated: {team.lastUpdated}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
