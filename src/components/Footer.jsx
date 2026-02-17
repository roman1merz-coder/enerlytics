import { Zap } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-in">
        <div className="footer-mark">
          <Zap size={12} />
        </div>
        <span className="footer-name">Enerlytics</span>
        <span className="footer-sep">·</span>
        <span className="footer-tag">Engineering data for clean-tech decisions. Built in DACH.</span>
      </div>
    </footer>
  );
}
