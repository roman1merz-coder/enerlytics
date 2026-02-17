import { Routes, Route } from 'react-router-dom';
import { CompareProvider } from './context/CompareContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Landing from './pages/Landing';
import EVDatabase from './pages/EVDatabase';
import EVDetail from './pages/EVDetail';
import Compare from './pages/Compare';
import Matcher from './pages/Matcher';
import './App.css';

export default function App() {
  return (
    <FavoritesProvider>
      <CompareProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/evs" element={<EVDatabase />} />
          <Route path="/evs/:slug" element={<EVDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/match" element={<Matcher />} />
        </Routes>
      </CompareProvider>
    </FavoritesProvider>
  );
}
