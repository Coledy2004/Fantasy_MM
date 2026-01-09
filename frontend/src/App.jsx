import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AllTeamsPage from './pages/AllTeamsPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-mm-light">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/standings" element={<AllTeamsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
