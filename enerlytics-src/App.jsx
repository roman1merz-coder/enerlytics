import { Routes, Route } from 'react-router-dom';
import { CompareProvider } from './context/CompareContext';
import Landing from './pages/Landing';
import EVDatabase from './pages/EVDatabase';
import EVDetail from './pages/EVDetail';
import Compare from './pages/Compare';
import './App.css';

export default function App() {
  return (
    <CompareProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/evs" element={<EVDatabase />} />
        <Route path="/evs/:slug" element={<EVDetail />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </CompareProvider>
  );
}
