import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';
import './Nav.css';

export default function Nav() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleNavClick = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <nav className="nav">
      <div className="nav-in">
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="logo-ic">
            <Zap size={16} />
          </div>
          <span className="logo-t">Enerlytics</span>
        </Link>
        <div className="nav-links">
          <Link to="/evs">EVs</Link>
          <Link to="/storage">Storage</Link>
          <Link to="/match">Match</Link>
          <a href="#methodology">Methodology</a>
          <a href="#about">About</a>
        </div>
        <button
          className="nav-cta"
          onClick={() => navigate('/evs')}
        >
          Get Started
        </button>

        {/* Mobile Hamburger Menu */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={closeMenu} />
      )}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <Link to="/evs" onClick={() => handleNavClick('/evs')}>
          EVs
        </Link>
        <Link to="/storage" onClick={() => handleNavClick('/storage')}>
          Storage
        </Link>
        <Link to="/match" onClick={() => handleNavClick('/match')}>
          Match
        </Link>
        <a href="#methodology" onClick={closeMenu}>
          Methodology
        </a>
        <a href="#about" onClick={closeMenu}>
          About
        </a>
        <button
          className="mobile-menu-cta"
          onClick={() => handleNavClick('/evs')}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
