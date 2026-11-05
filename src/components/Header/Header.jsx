import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/logo.png" alt="DevToolBox Logo" className="logo-image" />
          <span className="logo-text">DevToolBox</span>
        </Link>
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu} end>Home</NavLink>
          <NavLink to="/tools" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Tools</NavLink>
          <NavLink to="/blog" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Blog</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>About</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
