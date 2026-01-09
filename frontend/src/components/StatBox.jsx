import React from 'react';

export default function StatBox({ label, value, icon, trend, trendLabel }) {
  return (
    <div className="mm-stat-box">
      <div className="flex items-center justify-center mb-2">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-white text-sm font-semibold mb-1 opacity-90">{label}</p>
      <p className="text-4xl font-bold text-white">{value}</p>
      {trend !== undefined && (
        <p className={`text-xs font-semibold mt-2 ${trend >= 0 ? 'text-mm-success' : 'text-mm-warning'}`}>
          {trend >= 0 ? '↑' : '↓'} {trendLabel}
        </p>
      )}
    </div>
  );
}
