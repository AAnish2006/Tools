import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead/SEOHead';
import AdBanner from '../../components/AdBanner/AdBanner';
import './Notepad.css';

const Notepad = () => {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  // Default mode is dark theme!
  const [darkMode, setDarkMode] = useState(true);
  const [isFullPage, setIsFullPage] = useState(false);

  useEffect(() => {
    const savedText = localStorage.getItem('devtoolbox-notepad');
    if (savedText) setText(savedText);
    const savedFont = localStorage.getItem('devtoolbox-notepad-font');
    if (savedFont) setFontSize(parseInt(savedFont));
    
    // Check saved theme, default to true (dark mode) if not set
    const savedDark = localStorage.getItem('devtoolbox-notepad-dark');
    if (savedDark !== null) {
      setDarkMode(savedDark === 'true');
    } else {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('devtoolbox-notepad', text);
      if (text) setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 500);
    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => {
    localStorage.setItem('devtoolbox-notepad-font', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('devtoolbox-notepad-dark', darkMode.toString());
  }, [darkMode]);

  // Handle escape key to exit full page mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullPage) {
        setIsFullPage(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullPage]);

  // Lock body scroll and handle full viewport when in full page mode
  useEffect(() => {
    if (isFullPage) {
      document.body.classList.add('notepad-fullpage-open');
    } else {
      document.body.classList.remove('notepad-fullpage-open');
    }
    return () => {
      document.body.classList.remove('notepad-fullpage-open');
    };
  }, [isFullPage]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notepad-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [text]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }, [text]);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all text?')) {
      setText('');
      localStorage.removeItem('devtoolbox-notepad');
    }
  };

  const toggleFullPage = () => {
    setIsFullPage(prev => !prev);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const lineCount = text ? text.split('\n').length : 0;

  const notepadFaqs = [
    {
      question: "Does this online notepad save my notes automatically?",
      answer: "Yes, every keystroke is automatically saved to your browser's persistent local storage. Even if you accidentally close the tab or reboot your computer, your notes will remain intact."
    },
    {
      question: "Is there a dark mode in this notepad?",
      answer: "Yes! The notepad opens by default in high-contrast Dark Mode to reduce eye fatigue during late-night writing or coding sessions. You can switch to Light Mode at any time with a single click."
    },
    {
      question: "How do I use the full-page expansion mode?",
      answer: "Click the 'Expand Full Page' button in the toolbar (or press Escape to exit). The editor will smoothly expand to cover your entire browser viewport with an edge-to-edge distraction-free writing environment."
    },
    {
      question: "Is my text private and secure?",
      answer: "100% private. Your notes never leave your computer. We do not use any cloud servers, databases, or third-party storage for your written text."
    }
  ];

  const structuredData = [
    {
      "@type": "WebApplication",
      "name": "Online Notepad - DevToolBox",
      "url": "https://tools.trendbit.lol/tools/notepad",
      "description": "Free online notepad with auto-save and dark mode. Write notes, code snippets, and drafts directly in your browser with zero signup.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All modern browsers",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://tools.trendbit.lol/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Tools",
          "item": "https://tools.trendbit.lol/tools"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Online Notepad",
          "item": "https://tools.trendbit.lol/tools/notepad"
        }
      ]
    }
  ];

  return (
    <div className={`notepad-page ${isFullPage ? 'page-in-fullpage' : ''}`}>
      <SEOHead
        title="Online Notepad — Free Dark Mode Text Editor (Auto-Save, No Signup)"
        description="Free online notepad with auto-save and dark theme. Write notes, drafts, and code snippets in an edge-to-edge full-page browser canvas. 100% private."
        keywords="online notepad, free text editor, dark mode notepad, browser notepad, write notes online, text editor no signup, auto save notepad"
        canonicalUrl="/tools/notepad"
        structuredData={structuredData}
        faqData={notepadFaqs}
      />

      {!isFullPage && (
        <div className="notepad-header">
          <div>
            <h1>Online Notepad</h1>
            <p className="notepad-subtitle">
              Free browser-based text editor with default dark theme, auto-save, and full-page expansion.
            </p>
          </div>
        </div>
      )}

      {/* Main Notepad Workspace (Expands to fill entire webpage / screen when Full Page is active) */}
      <div className={`notepad-workspace ${isFullPage ? 'fullpage-active' : ''} ${darkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="notepad-toolbar">
          <div className="toolbar-left">
            <button 
              onClick={toggleFullPage} 
              className={`toolbar-btn toolbar-btn-fullpage ${isFullPage ? 'active' : ''}`}
              title={isFullPage ? 'Exit Full Page (Esc)' : 'Expand notepad to entire webpage'}
            >
              {isFullPage ? '⤢ Exit Full Page' : '⛶ Full Page'}
            </button>
            <button onClick={handleCopy} className="toolbar-btn" title="Copy text to clipboard">📋 Copy</button>
            <button onClick={handleDownload} className="toolbar-btn" title="Download text as .txt">💾 Download</button>
            <button onClick={handleClear} className="toolbar-btn toolbar-btn-danger" title="Clear notepad text">🗑️ Clear</button>
          </div>
          <div className="toolbar-right">
            <label className="font-size-control">
              <span>Size:</span>
              <input
                type="range"
                min="14"
                max="32"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
              />
              <span>{fontSize}px</span>
            </label>

            {/* Default is dark mode. Option to switch to Light Mode / Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="toolbar-btn theme-toggle-btn"
              title={darkMode ? "Switch to light mode" : "Switch back to dark mode"}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>

            {isFullPage && (
              <span className="fullpage-esc-hint">Press <code>Esc</code> to exit</span>
            )}
          </div>
        </div>

        <div className="notepad-editor">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing your notes here... Your notes are automatically saved to your browser in real time."
            style={{ fontSize: `${fontSize}px` }}
            spellCheck="true"
            aria-label="Online notepad text editor"
            autoFocus={isFullPage}
          />
        </div>

        <div className="notepad-status">
          <div className="status-left">
            {saved ? (
              <span className="save-indicator">✓ Saved to browser</span>
            ) : (
              <span className="auto-save-label">Auto-save active</span>
            )}
            <span className="status-theme-label">Theme: {darkMode ? 'Dark' : 'Light'}</span>
          </div>
          <div className="status-right">
            <span><strong>{wordCount}</strong> words</span>
            <span><strong>{charCount}</strong> characters</span>
            <span><strong>{lineCount}</strong> lines</span>
          </div>
        </div>
      </div>

      {!isFullPage && (
        <>
          <AdBanner slot="notepad-below" format="rectangle" />

          <section className="tool-seo-content">
            <h2>About Our Free Online Notepad</h2>
            <p>
              The DevToolBox <strong>Online Notepad</strong> is a free, browser-based text editor designed for quick note-taking, 
              drafting content, and writing code snippets. By default, it opens in a modern, eye-friendly <strong>dark theme</strong> 
              with an optional light mode toggle, <strong>automatic saving</strong>, and a seamless <strong>full page expansion</strong> option.
            </p>
            <h3>Key Features</h3>
            <ul>
              <li><strong>Default Dark Theme:</strong> High contrast, eye-comfort dark background with option for light mode</li>
              <li><strong>Full Page Expansion:</strong> Expand notepad to the entire webpage for an edge-to-edge distraction-free canvas</li>
              <li><strong>Continuous Auto-Save:</strong> Never lose an idea; your notes persist in local browser storage</li>
              <li><strong>One-Click Export:</strong> Download notes instantly as plain text (.txt) files</li>
              <li><strong>Adjustable Typography:</strong> Slider controls for font sizes from 14px to 32px</li>
              <li><strong>Zero Account Required:</strong> 100% private, instant access without signups or tracking</li>
            </ul>
            <p>
              Analyze your text metrics in detail using our <Link to="/tools/word-counter">Word Counter</Link>, or format and validate API responses with our <Link to="/tools/json-formatter">JSON Formatter</Link>.
            </p>

            <h3>Frequently Asked Questions</h3>
            <div className="notepad-faqs-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notepadFaqs.map((faq, i) => (
                <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.05rem' }}>{faq.question}</h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Notepad;
