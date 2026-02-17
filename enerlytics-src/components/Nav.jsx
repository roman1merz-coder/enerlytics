import { Link, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import './Nav.css';

export default function Nav() {
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <div className="nav-in">
        <Link to="/" className="logo">
          <div className="logo-ic">
            <Zap size={16} />
          </div>
          <span className="logo-t">Enerlytics</span>
        </Link>
        <div className="nav-links">
          <Link to="/evs">EVs</Link>
          <a href="#methodology">Methodology</a>
          <a href="#about">About</a>
        </div>
        <button
          className="nav-cta"
          onClick={() => navigate('/evs')}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
