import { createBrowserRouter, Navigate } from 'react-router';
import AppLayout from '../components/AppLayout';
import AboutPage from '../pages/AboutPage';
import GamePage from '../pages/GamePage';
import HomePage from '../pages/HomePage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/game', element: <GamePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
