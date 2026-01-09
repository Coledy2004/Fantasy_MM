import React from 'react';

export default function PlayerCard({ player, isEliminated = false }) {
  return (
    <div className="mm-player-card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{player.name}</h3>
          <p className="text-sm text-mm-text">{player.ncaaTeam} (Seed {player.seed})</p>
        </div>
        {isEliminated && (
          <span className="mm-eliminated-badge">Eliminated</span>
        )}
      </div>
      
      <div className="border-t border-mm-border pt-3">
        <p className="text-xs text-mm-text mb-2">TOURNAMENT POINTS</p>
        <p className="text-3xl font-bold text-mm-sky">{player.totalPoints}</p>
        <p className="text-xs text-mm-text mt-1">{player.gamesPlayed} games</p>
      </div>

      {player.recentGames && player.recentGames.length > 0 && (
        <div className="mt-3 pt-3 border-t border-mm-border">
          <p className="text-xs font-semibold text-mm-text mb-2">Recent Games</p>
          <div className="flex space-x-2">
            {player.recentGames.map((game, idx) => (
              <div key={idx} className="flex-1 text-center">
                <span className={`text-sm font-bold ${game.points > 0 ? 'text-mm-success' : 'text-gray-500'}`}>
                  {game.points}
                </span>
                <p className="text-xs text-mm-text">{game.opponent.slice(0, 3)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
