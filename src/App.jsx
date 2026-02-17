import { Routes, Route } from 'react-router-dom';
import { CompareProvider } from './context/CompareContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { StorageCompareProvider } from './context/StorageCompareContext';
import { StorageFavoritesProvider } from './context/StorageFavoritesContext';
import Landing from './pages/Landing';
import EVDatabase from './pages/EVDatabase';
import EVDetail from './pages/EVDetail';
import Compare from './pages/Compare';
import Matcher from './pages/Matcher';
import StorageDatabase from './pages/StorageDatabase';
import StorageDetail from './pages/StorageDetail';
import './App.css';

export default function App() {
  return (
    <FavoritesProvider>
      <CompareProvider>
        <StorageFavoritesProvider>
          <StorageCompareProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/evs" element={<EVDatabase />} />
              <Route path="/evs/:slug" element={<EVDetail />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/match" element={<Matcher />} />
              <Route path="/storage" element={<StorageDatabase />} />
              <Route path="/storage/:slug" element={<StorageDetail />} />
            </Routes>
          </StorageCompareProvider>
        </StorageFavoritesProvider>
      </CompareProvider>
    </FavoritesProvider>
  );
}
