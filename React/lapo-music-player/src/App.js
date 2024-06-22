import React from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Callback from './pages/Callback';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar/Sidebar';
import PlayerPage from './pages/PlayerPage';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <Routes>
          <Route path="/callback" element={<Callback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute element={HomePage} />} />
          <Route path="/player" element={<PrivateRoute element={PlayerPage} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
