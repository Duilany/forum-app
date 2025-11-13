// src/App.jsx
import React from 'react';
import {
  Routes, Route, NavLink, useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HomePage from './pages/HomePage';
import ThreadPage from './pages/ThreadPage';
import NewThreadPage from './pages/NewThreadPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { logout } from './features/auth/authSlice';

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-blue-800 text-white py-4 text-center font-bold text-lg">
        DICODING FORUM APP
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow container mx-auto p-4 pb-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/threads/create" element={<NewThreadPage />} />
          {' '}
          {/* ✅ route buat thread */}
          <Route path="/threads/:id" element={<ThreadPage />} />
          {' '}
          {/* ✅ detail thread */}
          <Route path="/leaderboards" element={<LeaderboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>

      {/* FOOTER NAV */}
      <footer className="bg-white border-t fixed bottom-0 w-full flex justify-around py-3 text-sm">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'text-blue-600 font-medium' : 'text-gray-700')}
        >
          Threads
        </NavLink>

        <NavLink
          to="/leaderboards"
          className={({ isActive }) => (isActive ? 'text-blue-600 font-medium' : 'text-gray-700')}
        >
          Leaderboards
        </NavLink>

        {/* Jika belum login → tampilkan Login, jika sudah → tampilkan Logout */}
        {!token ? (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? 'text-blue-600 font-medium' : 'text-gray-700')}
          >
            Login
          </NavLink>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="text-red-600 font-medium hover:underline"
          >
            Logout
          </button>
        )}
      </footer>
    </div>
  );
}
