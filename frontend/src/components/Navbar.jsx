import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-mm-navy shadow-lg border-b-4 border-mm-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-mm-gold rounded-lg flex items-center justify-center">
              <span className="text-mm-navy font-bold text-2xl">MM</span>
            </div>
            <div className="text-white hidden sm:block">
              <h1 className="text-xl font-bold">Fantasy March Madness</h1>
              <p className="text-mm-sky text-xs">NCAA Basketball Tournament</p>
            </div>
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-mm-gold transition-colors font-semibold"
            >
              My League
            </Link>
            <Link
              to="/standings"
              className="text-white hover:text-mm-gold transition-colors font-semibold"
            >
              All Teams
            </Link>
            <button className="mm-button-primary">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
