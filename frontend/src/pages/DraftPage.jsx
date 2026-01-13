import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DraftPage() {
  const [teams, setTeams] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [draftOrder, setDraftOrder] = useState([]);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [rounds, setRounds] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const leagueId = localStorage.getItem('selectedLeagueId');
      if (!leagueId) {
        setLoading(false);
        return;
      }

      try {
        const resp = await fetch(`${API_URL}/api/leagues/${leagueId}`);
        const data = await resp.json();
        const t = (data.teams || []).map(team => ({ id: team.id, name: team.name }));
        setTeams(t);

        // Build draft order for given rounds (snake order)
        const order = [];
        for (let r = 0; r < rounds; r++) {
          const ids = t.map(x => x.id);
          if (r % 2 === 1) ids.reverse();
          order.push(...ids);
        }
        setDraftOrder(order);

        // Load available players
        await fetchAvailablePlayers();
      } catch (e) {
        console.error('Error initializing draft', e);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [rounds]);

  async function fetchAvailablePlayers() {
    try {
      const resp = await fetch(`${API_URL}/api/available-players`);
      const data = await resp.json();
      setAvailablePlayers(data || []);
    } catch (e) {
      console.error('Error loading available players', e);
      setAvailablePlayers([]);
    }
  }

  async function generatePool() {
    try {
      const resp = await fetch(`${API_URL}/api/players/generate-from-espn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!resp.ok) {
        const error = await resp.json();
        console.error('Error from backend:', error);
        throw new Error(error.error || 'Failed to generate pool');
      }
      
      const data = await resp.json();
      console.log('Generated pool with', data.created, 'players');
      
      // Refresh the available players list
      await fetchAvailablePlayers();
    } catch (e) {
      console.error('Error generating pool:', e);
      alert('Failed to generate player pool: ' + e.message);
    }
  }

  async function pickPlayer(playerId) {
    if (!draftOrder || draftOrder.length === 0) return;
    const teamId = draftOrder[currentPickIndex];
    try {
      await fetch(`${API_URL}/api/players/${playerId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId })
      });

      // refresh available players and advance pick
      await fetchAvailablePlayers();
      setCurrentPickIndex(i => Math.min(i + 1, draftOrder.length - 1));
    } catch (e) {
      console.error('Error assigning player', e);
    }
  }

  const currentTeamId = draftOrder[currentPickIndex];
  const currentTeam = teams.find(t => t.id === currentTeamId);

  if (loading) return <div className="p-8">Loading draft...</div>;

  if (!localStorage.getItem('selectedLeagueId')) {
    return (
      <div className="p-8">No league selected. Go to Setup and select a league first.</div>
    );
  }

  return (
    <div className="min-h-screen bg-mm-light py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="mm-heading-1 mb-4">Snake Draft</h1>

        <div className="mb-4">
          <label className="text-sm text-gray-600 mr-2">Rounds:</label>
          <input type="number" min={1} value={rounds} onChange={e => setRounds(Number(e.target.value)||1)} className="px-2 py-1 border rounded" />
          <button onClick={generatePool} className="ml-4 px-3 py-1 bg-mm-sky text-white rounded">Generate Player Pool</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mm-card p-6 mb-4">
              <h2 className="mm-heading-2">Current Pick</h2>
              <p className="mt-2">Pick {currentPickIndex + 1} of {draftOrder.length}</p>
              <p className="text-lg font-bold mt-2">{currentTeam ? currentTeam.name : '—'}</p>
            </div>

            <div className="mm-card p-6">
              <h3 className="mm-heading-3 mb-4">Available Players</h3>
              {availablePlayers.length === 0 ? (
                <p>No available players. Generate pool.</p>
              ) : (
                <div className="space-y-2">
                  {availablePlayers.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-sm text-gray-600">{p.ncaaTeam} • Seed {p.seed}</div>
                      </div>
                      <div>
                        <button onClick={() => pickPlayer(p.id)} className="px-3 py-1 bg-mm-success text-white rounded">Draft</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mm-card p-6">
              <h3 className="mm-heading-3 mb-4">Teams</h3>
              <ul className="space-y-2">
                {teams.map(t => (
                  <li key={t.id} className={`p-2 rounded ${currentTeamId === t.id ? 'bg-mm-sky text-mm-dark font-bold' : 'bg-white'}`}>
                    {t.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
