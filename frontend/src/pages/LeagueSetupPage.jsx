import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LeagueSetupPage() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(() => {
    try {
      return localStorage.getItem('selectedLeagueId') || null;
    } catch (e) {
      return null;
    }
  });
  const [teams, setTeams] = useState([]);
  const [showNewLeagueForm, setShowNewLeagueForm] = useState(false);
  const [showNewTeamForm, setShowNewTeamForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [leagueName, setLeagueName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [ownerName, setOwnerName] = useState('');

  // Fetch leagues on mount
  useEffect(() => {
    fetchLeagues();
  }, []);

  // Fetch teams when league is selected
  useEffect(() => {
    if (selectedLeague) {
      fetchTeams(selectedLeague);
    }
  }, [selectedLeague]);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/leagues`);
      const data = await response.json();
      setLeagues(data);
      console.log('✅ Loaded leagues:', data);
    } catch (error) {
      console.error('❌ Error fetching leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async (leagueId) => {
    try {
      const response = await fetch(`${API_URL}/api/leagues/${leagueId}/teams`);
      const data = await response.json();
      setTeams(data);
      console.log('✅ Loaded teams:', data);
    } catch (error) {
      console.error('❌ Error fetching teams:', error);
    }
  };

  const createLeague = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/leagues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: leagueName })
      });
      const data = await response.json();
      setLeagues([...leagues, data]);
      setLeagueName('');
      setShowNewLeagueForm(false);
      setSelectedLeague(data.id);
      try { localStorage.setItem('selectedLeagueId', data.id); } catch (e) {}
      fetchTeams(data.id);
      console.log('✅ League created:', data);
    } catch (error) {
      console.error('❌ Error creating league:', error);
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();
    if (!selectedLeague) {
      alert('Please select a league first');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leagueId: selectedLeague,
          name: teamName,
          owner: ownerName
        })
      });
      const data = await response.json();
      // Refresh teams for the selected league
      fetchTeams(selectedLeague);
      setTeams([...teams, data]);
      setTeamName('');
      setOwnerName('');
      setShowNewTeamForm(false);
      console.log('✅ Team created:', data);
    } catch (error) {
      console.error('❌ Error creating team:', error);
    }
  };

  const resetDatabase = async () => {
    if (!window.confirm('Are you sure you want to reset ALL data? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reset`, {
        method: 'POST'
      });
      const data = await response.json();
      console.log('✅ Database reset:', data);
      setLeagues([]);
      setTeams([]);
      setSelectedLeague(null);
      fetchLeagues();
    } catch (error) {
      console.error('❌ Error resetting database:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-mm-dark py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mm-heading-1 mb-2">League Setup</h1>
          <p className="text-mm-text text-lg">Create your fantasy March Madness league and teams</p>
        </div>

        {/* Reset Button */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={resetDatabase}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
          >
            🗑️ Reset All Data
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leagues Section */}
          <div className="lg:col-span-1">
            <div className="mm-card p-6">
              <h2 className="mm-heading-2 mb-4">Leagues</h2>

              {leagues.length === 0 ? (
                <p className="text-mm-text mb-4">No leagues yet</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {leagues.map(league => (
                    <button
                      key={league.id}
                      onClick={() => setSelectedLeague(league.id)}
                      className={`w-full text-left p-3 rounded transition ${
                        selectedLeague === league.id
                          ? 'bg-mm-sky text-mm-dark font-bold'
                          : 'bg-mm-border hover:bg-mm-sky/20 text-mm-text'
                      }`}
                    >
                      {league.name}
                    </button>
                  ))}
                </div>
              )}

              {!showNewLeagueForm ? (
                <button
                  onClick={() => setShowNewLeagueForm(true)}
                  className="w-full px-4 py-2 bg-mm-sky hover:bg-mm-sky/80 text-mm-dark rounded font-semibold"
                >
                  + New League
                </button>
              ) : (
                <form onSubmit={createLeague} className="space-y-3">
                  <input
                    type="text"
                    placeholder="League name"
                    value={leagueName}
                    onChange={e => setLeagueName(e.target.value)}
                    className="w-full px-3 py-2 bg-mm-darker border border-mm-border rounded text-mm-text"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 bg-mm-success hover:bg-mm-success/80 text-mm-dark rounded font-semibold"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewLeagueForm(false)}
                      className="flex-1 px-3 py-2 bg-mm-border hover:bg-mm-border/80 text-mm-text rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Teams Section */}
          <div className="lg:col-span-2">
            <div className="mm-card p-6">
              <h2 className="mm-heading-2 mb-4">
                {selectedLeague ? 'Teams' : 'Select a league to see teams'}
              </h2>

              {selectedLeague && teams.length === 0 ? (
                <p className="text-mm-text mb-4">No teams in this league yet</p>
              ) : (
                <div className="space-y-3 mb-6">
                  {teams.map(team => (
                    <div
                      key={team.id}
                      className="mm-card p-4 border border-mm-border hover:border-mm-sky transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="mm-heading-3 text-mm-sky">{team.name}</h3>
                          <p className="text-sm text-mm-text">Owner: {team.owner}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-mm-success">{team.totalPoints}</p>
                          <p className="text-xs text-mm-text">Points</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedLeague && !showNewTeamForm ? (
                <button
                  onClick={() => setShowNewTeamForm(true)}
                  className="w-full px-4 py-2 bg-mm-sky hover:bg-mm-sky/80 text-mm-dark rounded font-semibold"
                >
                  + Add Team
                </button>
              ) : selectedLeague ? (
                <form onSubmit={createTeam} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Team name"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 bg-mm-darker border border-mm-border rounded text-mm-text"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Owner name"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2 bg-mm-darker border border-mm-border rounded text-mm-text"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 bg-mm-success hover:bg-mm-success/80 text-mm-dark rounded font-semibold"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewTeamForm(false)}
                      className="flex-1 px-3 py-2 bg-mm-border hover:bg-mm-border/80 text-mm-text rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
