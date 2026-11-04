import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="logo-icon">⚡</span> DevToolBox
            </h3>
            <p className="footer-desc">
              Free online developer tools to boost your productivity. No signup required. 
              Use our notepad, word counter, and JSON formatter instantly in your browser.
            </p>
          </div>
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <nav className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/tools">All Tools</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/about">About Us</Link>
            </nav>
          </div>
          <div className="footer-section">
            <h4 className="footer-subtitle">Our Tools</h4>
            <nav className="footer-links">
              <Link to="/tools/notepad">Online Notepad</Link>
              <Link to="/tools/word-counter">Word Counter</Link>
              <Link to="/tools/json-formatter">JSON Formatter</Link>
              <Link to="/tools/image-resizer">Image Resizer</Link>
              <Link to="/tools/password-generator">Password Generator</Link>
              <Link to="/tools/base64-encoder">Base64 Encoder</Link>
              <Link to="/tools/markdown-previewer">Markdown Previewer</Link>
            </nav>
          </div>
          <div className="footer-section">
            <h4 className="footer-subtitle">Legal</h4>
            <nav className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/sitemap.xml" target="_blank">Sitemap</Link>
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} DevToolBox. All rights reserved. Built with ❤️ for developers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
