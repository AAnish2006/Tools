import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead/SEOHead';
import AdBanner from '../../components/AdBanner/AdBanner';
import './WordCounter.css';

const PLATFORM_LIMITS = [
  {
    category: 'Default',
    options: [
      { id: 'general', name: 'General', limit: 20000, desc: 'Standard general text limit (20,000 characters)' }
    ]
  },
  {
    category: 'X (Twitter)',
    options: [
      { id: 'x-standard', name: 'X: Free / Standard Tweet', limit: 280, desc: 'Free accounts standard post limit' },
      { id: 'x-premium', name: 'X: Premium / Long Tweet', limit: 25000, desc: 'Subscribed X Premium long-form post' },
      { id: 'x-dm', name: 'X: Direct Messages (DMs)', limit: 10000, desc: 'Private direct messaging limit' },
      { id: 'x-bio', name: 'X: Profile Bio', limit: 160, desc: 'Short profile biography' },
      { id: 'x-name', name: 'X: Profile Display Name', limit: 50, desc: 'Profile account name' }
    ]
  },
  {
    category: 'Instagram',
    options: [
      { id: 'ig-caption', name: 'Instagram: Post Caption', limit: 2200, desc: 'Feed post & reel description' },
      { id: 'ig-bio', name: 'Instagram: Profile Bio', limit: 150, desc: 'Account profile biography' },
      { id: 'ig-comment', name: 'Instagram: Comment', limit: 2200, desc: 'Post comments limit' }
    ]
  },
  {
    category: 'LinkedIn',
    options: [
      { id: 'li-post', name: 'LinkedIn: Post / Status', limit: 3000, desc: 'Feed updates & articles' },
      { id: 'li-headline', name: 'LinkedIn: Profile Headline', limit: 220, desc: 'Professional headline under name' },
      { id: 'li-about', name: 'LinkedIn: About / Summary', limit: 2600, desc: 'Profile summary section' }
    ]
  },
  {
    category: 'Facebook',
    options: [
      { id: 'fb-post', name: 'Facebook: Post Status', limit: 63206, desc: 'Timeline post maximum length' },
      { id: 'fb-comment', name: 'Facebook: Comment', limit: 8000, desc: 'Timeline comment maximum' }
    ]
  },
  {
    category: 'YouTube',
    options: [
      { id: 'yt-title', name: 'YouTube: Video Title', limit: 100, desc: 'Video headline in search & feed' },
      { id: 'yt-desc', name: 'YouTube: Video Description', limit: 5000, desc: 'Detailed video information box' },
      { id: 'yt-channel', name: 'YouTube: Channel About', limit: 1000, desc: 'Channel description' }
    ]
  },
  {
    category: 'TikTok & Pinterest',
    options: [
      { id: 'tt-caption', name: 'TikTok: Video Caption', limit: 2200, desc: 'Video post caption' },
      { id: 'tt-bio', name: 'TikTok: Profile Bio', limit: 80, desc: 'Short profile biography' },
      { id: 'pin-title', name: 'Pinterest: Pin Title', limit: 100, desc: 'Headline of the pin' },
      { id: 'pin-desc', name: 'Pinterest: Pin Description', limit: 500, desc: 'Pin body description' }
    ]
  },
  {
    category: 'SEO & Search Snippets',
    options: [
      { id: 'seo-title', name: 'Google: SEO Meta Title', limit: 60, desc: 'Ideal snippet title length in SERP' },
      { id: 'seo-desc', name: 'Google: SEO Meta Description', limit: 160, desc: 'Ideal search snippet description' }
    ]
  },
  {
    category: 'Messaging',
    options: [
      { id: 'sms-single', name: 'SMS: Single Text Message', limit: 160, desc: 'Single GSM-7 character carrier SMS' }
    ]
  }
];

// Flat list for easy ID lookup
const ALL_OPTIONS = PLATFORM_LIMITS.flatMap(cat => cat.options);

const WordCounter = () => {
  const [text, setText] = useState('');
  const [selectedPlatformId, setSelectedPlatformId] = useState('general');

  const selectedPlatform = useMemo(() => {
    return ALL_OPTIONS.find(opt => opt.id === selectedPlatformId) || ALL_OPTIONS[0];
  }, [selectedPlatformId]);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpace = text.replace(/\s/g, '').length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);

    // Top keywords
    const wordList = trimmed.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const freq = {};
    wordList.forEach(w => {
      const clean = w.replace(/[^a-z0-9]/g, '');
      if (clean.length > 3) freq[clean] = (freq[clean] || 0) + 1;
    });
    const topKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count, density: words > 0 ? ((count / words) * 100).toFixed(1) : 0 }));

    return { words, characters, charactersNoSpace, sentences, paragraphs, readingTime, speakingTime, topKeywords };
  }, [text]);

  const limitInfo = useMemo(() => {
    if (!selectedPlatform) return null;
    const limit = selectedPlatform.limit;
    const count = stats.characters;
    const isExceeded = count > limit;
    const diff = Math.abs(limit - count);
    const percent = Math.min(100, Math.round((count / limit) * 100));

    // Split text for visual highlighting of extra characters
    const validPart = isExceeded ? text.slice(0, limit) : text;
    const excessPart = isExceeded ? text.slice(limit) : '';

    return {
      limit,
      count,
      isExceeded,
      diff,
      percent,
      validPart,
      excessPart
    };
  }, [selectedPlatform, stats.characters, text]);

  const handleClear = () => setText('');

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setText(clipText);
    } catch {
      // Fallback
    }
  };

  const handleTrimToLimit = () => {
    if (selectedPlatform && text.length > selectedPlatform.limit) {
      setText(text.slice(0, selectedPlatform.limit));
    }
  };

  const wordCounterFaqs = [
    {
      question: "What is the X (Twitter) character limit in 2026?",
      answer: "Standard free accounts on X (formerly Twitter) have a limit of 280 characters per tweet. Subscribed X Premium users can write up to 25,000 characters. Our tool checks both limits with live overflow highlighting."
    },
    {
      question: "How does the red overflow highlighting work?",
      answer: "Whenever your text exceeds the selected platform's limit, the exact characters exceeding the limit turn bright red in the editor. You can also click 'Trim to Limit' to automatically prune the excess."
    },
    {
      question: "How is reading time calculated?",
      answer: "Reading time is estimated based on the standard average adult reading speed of 200 words per minute (wpm)."
    },
    {
      question: "What is keyword density in this word counter?",
      answer: "Keyword density indicates the percentage frequency of key words in your text, helping content writers and SEO professionals prevent keyword stuffing while optimizing for search engines."
    }
  ];

  const structuredData = [
    {
      "@type": "WebApplication",
      "name": "Word Counter & Character Checker - DevToolBox",
      "url": "https://tools.trendbit.lol/tools/word-counter",
      "description": "Free online word counter and social media character limit checker. Count words, characters, sentences, paragraphs with live overflow highlighting.",
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
          "name": "Word Counter",
          "item": "https://tools.trendbit.lol/tools/word-counter"
        }
      ]
    }
  ];

  return (
    <div className="wordcounter-page">
      <SEOHead
        title="Word Counter Online — Character & Social Media Limit Counter (Free)"
        description="Free online word counter and social media character checker. Count words, characters, sentences, and paragraphs with live platform limit highlighting for X, Instagram, LinkedIn & YouTube."
        keywords="word counter, character counter, twitter character counter, social media character limit, X tweet length, keyword density, SEO word counter"
        canonicalUrl="/tools/word-counter"
        structuredData={structuredData}
        faqData={wordCounterFaqs}
      />

      <div className="wc-header">
        <h1>Word Counter & Platform Character Checker</h1>
        <p className="wc-subtitle">
          Count words, characters, sentences, and paragraphs in real time. Select social media platforms to check character limits and highlight overflow text automatically.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="wc-stats-grid">
        <div className="wc-stat-card">
          <span className="wc-stat-number">{stats.words}</span>
          <span className="wc-stat-label">Words</span>
        </div>
        <div className="wc-stat-card">
          <span className="wc-stat-number">{stats.characters}</span>
          <span className="wc-stat-label">Characters</span>
        </div>
        <div className="wc-stat-card">
          <span className="wc-stat-number">{stats.charactersNoSpace}</span>
          <span className="wc-stat-label">Chars (No Spaces)</span>
        </div>
        <div className="wc-stat-card">
          <span className="wc-stat-number">{stats.sentences}</span>
          <span className="wc-stat-label">Sentences</span>
        </div>
        <div className="wc-stat-card">
          <span className="wc-stat-number">{stats.paragraphs}</span>
          <span className="wc-stat-label">Paragraphs</span>
        </div>
        <div className="wc-stat-card">
          <span className="wc-stat-number">{stats.readingTime} min</span>
          <span className="wc-stat-label">Reading Time</span>
        </div>
      </div>

      {/* Platform Character Limit Selector & Progress Bar */}
      <div className="wc-platform-selector-box">
        <div className="platform-header-row">
          <div className="platform-dropdown-wrapper">
            <label htmlFor="platform-select" className="platform-label">
              <span className="platform-icon">🎯</span> Select Platform Limit:
            </label>
            <select
              id="platform-select"
              value={selectedPlatformId}
              onChange={(e) => setSelectedPlatformId(e.target.value)}
              className="platform-dropdown"
              aria-label="Select social media platform to verify character limits"
            >
              <option value="general">
                General (20,000 characters)
              </option>
              {PLATFORM_LIMITS.filter(g => g.category !== 'Default').map((group) => (
                <optgroup key={group.category} label={group.category}>
                  {group.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} ({opt.limit.toLocaleString()} chars)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="platform-quick-stats">
            {limitInfo && (
              <span className={`platform-status-badge ${limitInfo.isExceeded ? 'badge-exceeded' : 'badge-safe'}`}>
                {limitInfo.isExceeded ? (
                  <>⚠️ Exceeded by <strong>{limitInfo.diff.toLocaleString()}</strong> chars</>
                ) : (
                  <>✓ <strong>{limitInfo.diff.toLocaleString()}</strong> chars remaining</>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        {limitInfo && (
          <div className="platform-progress-container">
            <div className="platform-progress-meta">
              <span className="progress-text-label">
                <strong>{stats.characters.toLocaleString()}</strong> of <strong>{limitInfo.limit.toLocaleString()}</strong> characters used
              </span>
              <span className="progress-percent-label">{limitInfo.percent}%</span>
            </div>
            <div className="platform-progress-track">
              <div
                className={`platform-progress-fill ${
                  limitInfo.isExceeded
                    ? 'fill-exceeded'
                    : limitInfo.percent > 85
                    ? 'fill-warning'
                    : 'fill-normal'
                }`}
                style={{ width: `${limitInfo.percent}%` }}
                role="progressbar"
                aria-valuenow={stats.characters}
                aria-valuemin="0"
                aria-valuemax={limitInfo.limit}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="wc-actions">
        <button onClick={handlePaste} className="toolbar-btn">📋 Paste Text</button>
        {limitInfo && limitInfo.isExceeded && (
          <button onClick={handleTrimToLimit} className="toolbar-btn toolbar-btn-trim" title="Trim extra characters exceeding the platform limit">
            ✂️ Trim Extra Characters
          </button>
        )}
        <button onClick={handleClear} className="toolbar-btn toolbar-btn-danger">🗑️ Clear Text</button>
      </div>

      {/* Textarea Input */}
      <textarea
        className={`wc-textarea ${limitInfo && limitInfo.isExceeded ? 'wc-textarea-exceeded' : ''}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here to count words, characters, and check platform limits..."
        aria-label="Text input for word and character counting"
      />

      {/* Real-time Over-limit Character Highlighter Panel */}
      {limitInfo && limitInfo.isExceeded && (
        <div className="overflow-highlighter-card" role="alert">
          <div className="overflow-highlighter-header">
            <div className="overflow-title-group">
              <span className="overflow-alert-icon">🚨</span>
              <h3>Character Overflow Alert</h3>
              <span className="overflow-count-pill">
                +{limitInfo.excessPart.length} extra characters
              </span>
            </div>
            <button onClick={handleTrimToLimit} className="btn-trim-action">
              ✂️ Trim to {limitInfo.limit.toLocaleString()} chars
            </button>
          </div>

          <p className="overflow-instruction">
            The red highlighted characters below exceed the <strong>{selectedPlatform.name}</strong> limit ({limitInfo.limit.toLocaleString()} characters) and will be rejected or truncated when posted:
          </p>

          <div className="overflow-visual-preview">
            <span className="text-valid">{limitInfo.validPart}</span>
            <mark className="text-excess" title={`These ${limitInfo.excessPart.length} characters exceed the allowed limit`}>
              {limitInfo.excessPart}
            </mark>
          </div>
        </div>
      )}

      <AdBanner slot="wc-mid" format="horizontal" />

      {/* Keyword Density Analytics */}
      {stats.topKeywords.length > 0 && (
        <div className="wc-keywords">
          <h2>Keyword Density & Term Frequency</h2>
          <div className="keywords-table">
            <div className="keywords-header">
              <span>Keyword</span>
              <span>Count</span>
              <span>Density</span>
            </div>
            {stats.topKeywords.map((kw, i) => (
              <div key={i} className="keyword-row">
                <span className="keyword-word">{kw.word}</span>
                <span className="keyword-count">{kw.count}</span>
                <span className="keyword-density">{kw.density}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <AdBanner slot="wc-bottom" format="rectangle" />

      <section className="tool-seo-content">
        <h2>About Our Free Word Counter & Social Media Character Checker</h2>
        <p>
          The DevToolBox <strong>Word Counter</strong> is a comprehensive text analysis and character limit verification tool. 
          Whether you are writing a post for <strong>X (Twitter)</strong>, optimizing an <strong>Instagram</strong> caption, drafting a 
          <strong> LinkedIn</strong> update, or tuning <strong>Google SEO</strong> meta tags, our tool calculates words and characters in real time 
          and highlights every single overflowing character that exceeds platform constraints.
        </p>

        <h3>Popular Platform Limits Built In</h3>
        <ul>
          <li><strong>X (Twitter):</strong> Standard Tweet (280 chars), X Premium long-form (25,000 chars), Direct Messages (10,000 chars), Bio (160 chars)</li>
          <li><strong>Instagram:</strong> Captions (2,200 chars), Profile Bio (150 chars)</li>
          <li><strong>LinkedIn:</strong> Status Posts (3,000 chars), Headline (220 chars), About Summary (2,600 chars)</li>
          <li><strong>YouTube:</strong> Titles (100 chars), Video Descriptions (5,000 chars)</li>
          <li><strong>TikTok:</strong> Captions (2,200 chars), Bio (80 chars)</li>
          <li><strong>Search Engine SEO:</strong> Google Meta Title (60 chars), Meta Description (160 chars)</li>
        </ul>

        <p>
          Need a distraction-free notepad? Open our <Link to="/tools/notepad">Online Notepad</Link> with default dark theme and auto-save. 
          Debugging API structures? Try our <Link to="/tools/json-formatter">JSON Formatter</Link>. Read our 
          <Link to="/blog"> blog</Link> for proven content optimization strategies.
        </p>

        <h3>Frequently Asked Questions</h3>
        <div className="wc-faqs-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {wordCounterFaqs.map((faq, i) => (
            <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.05rem' }}>{faq.question}</h4>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WordCounter;
