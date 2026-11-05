import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead/SEOHead';
import AdBanner from '../components/AdBanner/AdBanner';
import './Home.css';

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const structuredData = [
    {
      "@type": "SoftwareApplication",
      "name": "DevToolBox Developer Suite",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All modern browsers (Chrome, Edge, Safari, Firefox)",
      "url": "https://tools.trendbit.lol",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      }
    }
  ];

  const faqs = [
    {
      question: "Are these developer tools completely free to use?",
      answer: "Yes, 100% free. There are no paywalls, subscriptions, or hidden charges. You don't even need to create an account or provide an email address."
    },
    {
      question: "Is my text, code, or image data uploaded to any server?",
      answer: "Never. All utilities run 100% inside your local web browser using client-side JavaScript, HTML5 Canvas, and local storage. Your data remains strictly on your device."
    },
    {
      question: "Does the Online Notepad save my work if I accidentally close the tab?",
      answer: "Yes! The notepad continuously auto-saves your text to your browser's persistent local storage every 500 milliseconds. When you return, your notes are right where you left them."
    },
    {
      question: "Can I check character limits for X (Twitter), Instagram, and LinkedIn?",
      answer: "Yes. Our Word Counter includes instant platform limit checks for X (standard and premium tweets, bios), Instagram captions, LinkedIn posts, Facebook, YouTube, TikTok, and Pinterest with real-time red overflow highlighting and a one-click trim button."
    }
  ];

  const tools = [
    {
      title: 'Online Stopwatch & Timer',
      desc: 'High-precision millisecond stopwatch with split lap tracking, countdown timer presets, audio chime alarm, and fullscreen view.',
      icon: '⏱️',
      link: '/tools/stopwatch',
      color: '#0284c7'
    },
    {
      title: 'Online Notepad',
      desc: 'A fast, distraction-free online text editor. Write notes, code snippets, and drafts instantly in your browser with default dark mode, auto-save, and full page expansion.',
      icon: '📝',
      link: '/tools/notepad',
      color: '#2563eb'
    },
    {
      title: 'Word Counter',
      desc: 'Count words, characters, sentences, and paragraphs in real-time. Verify social media character limits (X, Instagram, LinkedIn) with live overflow highlighting.',
      icon: '🔢',
      link: '/tools/word-counter',
      color: '#10b981'
    },
    {
      title: 'JSON Formatter',
      desc: 'Format, validate, beautify, and minify JSON data with syntax error detection. 100% private in-browser debugging for API payloads.',
      icon: '{ }',
      link: '/tools/json-formatter',
      color: '#f59e0b'
    },
    {
      title: 'Image Resizer',
      desc: 'Resize JPG, PNG, and WEBP images directly on HTML5 Canvas. Lock aspect ratios, adjust quality, and apply presets with zero server uploads.',
      icon: '🖼️',
      link: '/tools/image-resizer',
      color: '#ec4899'
    },
    {
      title: 'Password Generator',
      desc: 'Generate cryptographically strong passwords and memorable passphrases with instant entropy analysis and customizable length.',
      icon: '🔑',
      link: '/tools/password-generator',
      color: '#8b5cf6'
    },
    {
      title: 'Base64 & URL Encoder',
      desc: 'Encode and decode Base64 strings, URL parameters, and convert files to Base64 Data URIs with full UTF-8 & emoji support.',
      icon: '📦',
      link: '/tools/base64-encoder',
      color: '#06b6d4'
    },
    {
      title: 'Markdown Previewer',
      desc: 'Draft documentation, READMEs, and blogs with live side-by-side Markdown to HTML preview, formatting toolbar, and instant export.',
      icon: '📝',
      link: '/tools/markdown-previewer',
      color: '#14b8a6'
    },
    {
      title: 'UUID / GUID Generator',
      desc: 'Generate cryptographically random UUID v4 identifiers in bulk, customizable hyphens/uppercase, and live Unix timestamp converter.',
      icon: '🆔',
      link: '/tools/uuid-generator',
      color: '#6366f1'
    },
    {
      title: 'Color Converter & Contrast',
      desc: 'Convert HEX, RGB, and HSL colors with one-click CSS copy, palette tints & shades, and WCAG 2.1 accessibility contrast audits.',
      icon: '🎨',
      link: '/tools/color-converter',
      color: '#f43f5e'
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="home-page">
      <SEOHead
        title="DevToolBox — Online Notepad, Word Counter, JSON Formatter & Image Resizer"
        description="DevToolBox offers 100% free browser tools: Online Notepad with auto-save & dark mode, Word Counter with social media limits, JSON Formatter & Validator, and Image Resizer. 100% private with no signup required."
        keywords="DevToolBox, free online developer tools, online notepad, word counter online, json formatter, image resizer online, text editor browser, character count twitter"
        canonicalUrl="/"
        structuredData={structuredData}
        faqData={faqs}
      />

      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🚀 100% Free & Private — No Signup Required</span>
          <h1 className="hero-title">Free Online Developer Tools</h1>
          <p className="hero-subtitle">
            Boost your productivity with our suite of free, browser-based utilities. 
            Take quick notes, count words against social media limits, format JSON, and resize images — all instantly, with zero server uploads.
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
          Powerful, privacy-focused utilities designed for developers, writers, and social media creators
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
            <p>All processing happens locally in your browser. Your sensitive code, notes, and photos never touch any remote server.</p>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <h3>Instant Performance</h3>
            <p>Zero network latency. Tools load and calculate synchronously using optimized HTML5 APIs.</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📱</span>
            <h3>Responsive & Accessible</h3>
            <p>Full support for mobile phones, tablets, and wide-screen desktop monitors.</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🆓</span>
            <h3>Always 100% Free</h3>
            <p>No subscriptions, no hidden limitations, and no credit card required. Pure utilities made for everyday use.</p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions for SEO and User Clarity */}
      <section className="home-faq-section" style={{ maxWidth: '900px', margin: '4rem auto', padding: '0 1rem' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
        <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          Everything you need to know about DevToolBox utilities and privacy
        </p>
        <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              style={{
                border: '1px solid #334155',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  color: '#f8fafc',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                aria-expanded={openFaq === index}
              >
                <span>{faq.question}</span>
                <span style={{ fontSize: '1.4rem', marginLeft: '1rem', transition: 'transform 0.2s', transform: openFaq === index ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {openFaq === index && (
                <div style={{ padding: '0 1.5rem 1.25rem', color: '#94a3b8', lineHeight: '1.6', fontSize: '1rem' }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Boost Your Productivity?</h2>
        <p>Start writing in our <Link to="/tools/notepad">Online Notepad</Link>, check text limits with the <Link to="/tools/word-counter">Word Counter</Link>, or format your JSON with the <Link to="/tools/json-formatter">JSON Formatter</Link> right now.</p>
        <Link to="/tools" className="btn btn-primary">Get Started — It's Free</Link>
      </section>
    </div>
  );
};

export default Home;
