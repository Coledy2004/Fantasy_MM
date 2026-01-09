import React from 'react';

export default function PlayerCard({ player, isEliminated = false }) {
  return (
    <div className="mm-player-card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-mm-navy">{player.name}</h3>
          <p className="text-sm text-gray-600">{player.ncaaTeam} (Seed {player.seed})</p>
        </div>
        {isEliminated && (
          <span className="mm-eliminated-badge">Eliminated</span>
        )}
      </div>
      
      <div className="border-t border-mm-light pt-3">
        <p className="text-xs text-gray-500 mb-2">TOURNAMENT POINTS</p>
        <p className="text-3xl font-bold text-mm-blue">{player.totalPoints}</p>
        <p className="text-xs text-gray-500 mt-1">{player.gamesPlayed} games</p>
      </div>

      {player.recentGames && player.recentGames.length > 0 && (
        <div className="mt-3 pt-3 border-t border-mm-light">
          <p className="text-xs font-semibold text-gray-600 mb-2">Recent Games</p>
          <div className="flex space-x-2">
            {player.recentGames.map((game, idx) => (
              <div key={idx} className="flex-1 text-center">
                <span className={`text-sm font-bold ${game.points > 0 ? 'text-mm-success' : 'text-gray-400'}`}>
                  {game.points}
                </span>
                <p className="text-xs text-gray-500">{game.opponent.slice(0, 3)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
