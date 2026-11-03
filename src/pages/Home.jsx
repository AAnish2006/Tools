import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead/SEOHead';
import AdBanner from '../components/AdBanner/AdBanner';
import './Home.css';

const Home = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DevToolBox",
    "url": "https://tools.trendbit.lol",
    "description": "Free online developer tools including notepad, word counter, and JSON formatter. No signup needed.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://tools.trendbit.lol/tools?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const tools = [
    {
      title: 'Online Notepad',
      desc: 'A fast, distraction-free online text editor. Write notes, code snippets, and drafts instantly in your browser with auto-save.',
      icon: '📝',
      link: '/tools/notepad',
      color: '#2563eb'
    },
    {
      title: 'Word Counter',
      desc: 'Count words, characters, sentences, and paragraphs in real-time. Perfect for SEO content, essays, and social media posts.',
      icon: '🔢',
      link: '/tools/word-counter',
      color: '#10b981'
    },
    {
      title: 'JSON Formatter',
      desc: 'Format, validate, and beautify JSON data with syntax highlighting. Debug API responses and config files effortlessly.',
      icon: '{ }',
      link: '/tools/json-formatter',
      color: '#f59e0b'
    },
    {
      title: 'Image Resizer',
      desc: 'Resize images with custom dimensions, aspect ratio lock, and presets for Instagram, YouTube, and X.',
      icon: '🖼️',
      link: '/tools/image-resizer',
      color: '#ec4899'
    }
  ];

  return (
    <div className="home-page">
      <SEOHead
        title="Free Online Developer Tools"
        description="DevToolBox offers free online developer tools: notepad, word counter, JSON formatter. No signup required. Boost your productivity instantly."
        keywords="online developer tools, free notepad, word counter, JSON formatter, text editor online, developer utilities"
        canonicalUrl="/"
        structuredData={structuredData}
      />

      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🚀 100% Free — No Signup Required</span>
          <h1 className="hero-title">Free Online Developer Tools</h1>
          <p className="hero-subtitle">
            Boost your productivity with our suite of free, browser-based developer tools. 
            Write notes, count words, format JSON — all instantly, all privately.
          </p>
          <div className="hero-cta">
            <Link to="/tools" className="btn btn-primary">Explore All Tools</Link>
            <Link to="/blog" className="btn btn-secondary">Read Our Blog</Link>
          </div>
        </div>
      </section>

      <AdBanner slot="home-hero-below" format="horizontal" />

      <section className="tools-section">
        <h2 className="section-title">Our Developer Tools</h2>
        <p className="section-subtitle">
          Powerful, free tools designed for developers, writers, and content creators
        </p>
        <div className="tools-grid">
          {tools.map((tool, index) => (
            <Link to={tool.link} key={index} className="tool-card">
              <div className="tool-icon" style={{ background: `${tool.color}15`, color: tool.color }}>
                {tool.icon}
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
              <span className="tool-link">Use Tool →</span>
            </Link>
          ))}
        </div>
      </section>

      <AdBanner slot="home-mid" format="rectangle" />

      <section className="why-section">
        <h2 className="section-title">Why Choose DevToolBox?</h2>
        <div className="features-grid">
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <h3>100% Private</h3>
            <p>All processing happens in your browser. Your data never leaves your device.</p>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <h3>Lightning Fast</h3>
            <p>No server requests needed. Tools load and respond instantly.</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📱</span>
            <h3>Works Everywhere</h3>
            <p>Fully responsive design. Use on desktop, tablet, or mobile.</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🆓</span>
            <h3>Always Free</h3>
            <p>No signup, no credit card, no hidden fees. Just open and use.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Boost Your Productivity?</h2>
        <p>Join thousands of developers who use DevToolBox daily. Start using our <Link to="/tools/notepad">online notepad</Link>, <Link to="/tools/word-counter">word counter</Link>, or <Link to="/tools/json-formatter">JSON formatter</Link> right now.</p>
        <Link to="/tools" className="btn btn-primary">Get Started — It's Free</Link>
      </section>
    </div>
  );
};

export default Home;
