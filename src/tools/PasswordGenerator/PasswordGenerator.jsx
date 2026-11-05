import { useState, useEffect, useCallback, useId } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead/SEOHead';
import AdBanner from '../../components/AdBanner/AdBanner';
import './PasswordGenerator.css';

const WORD_LIST = [
  'apple', 'beach', 'cloud', 'delta', 'eagle', 'forest', 'galaxy', 'harbor',
  'island', 'jungle', 'knight', 'lemon', 'meteor', 'nebula', 'ocean', 'planet',
  'quartz', 'river', 'shadow', 'thunder', 'valley', 'winter', 'zenith', 'anchor',
  'beacon', 'canyon', 'falcon', 'glacier', 'horizon', 'lagoon', 'meadow', 'oasis',
  'phoenix', 'rocket', 'safari', 'tiger', 'voyage', 'wizard', 'aurora', 'breeze',
  'crystal', 'dolphin', 'ember', 'feather', 'granite', 'haven', 'infinity', 'jasper',
  'kinetic', 'lotus', 'mirage', 'nova', 'orbit', 'pulse', 'quiver', 'radiant',
  'summit', 'titan', 'uranium', 'vortex', 'whisper', 'zephyr', 'blaze', 'cascade'
];

const PasswordGenerator = () => {
  const [mode, setMode] = useState('password'); // 'password' or 'passphrase'
  
  // Password Mode States
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  
  // Passphrase Mode States
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalizeWords, setCapitalizeWords] = useState(true);
  const [includeNumberInPassphrase, setIncludeNumberInPassphrase] = useState(true);

  // Output States
  const [currentPassword, setCurrentPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [batchCount, setBatchCount] = useState(1);
  const [batchPasswords, setBatchPasswords] = useState([]);

  // Generate cryptographically secure random integer in [0, max)
  const getCryptoRandomInt = (max) => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  };

  const generateSinglePassword = useCallback(() => {
    if (mode === 'passphrase') {
      const selectedWords = [];
      for (let i = 0; i < wordCount; i++) {
        let w = WORD_LIST[getCryptoRandomInt(WORD_LIST.length)];
        if (capitalizeWords) {
          w = w.charAt(0).toUpperCase() + w.slice(1);
        }
        selectedWords.push(w);
      }
      let result = selectedWords.join(separator);
      if (includeNumberInPassphrase) {
        const num = getCryptoRandomInt(100);
        result += `${separator}${num}`;
      }
      return result;
    }

    // Random Password Mode
    let upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    let numberChars = '0123456789';
    let symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeAmbiguous) {
      upperChars = upperChars.replace(/[IO]/g, '');
      lowerChars = lowerChars.replace(/[lo]/g, '');
      numberChars = numberChars.replace(/[01]/g, '');
      symbolChars = symbolChars.replace(/[|]/g, '');
    }

    let charPool = '';
    const guaranteed = [];

    if (includeUpper) {
      charPool += upperChars;
      guaranteed.push(upperChars[getCryptoRandomInt(upperChars.length)]);
    }
    if (includeLower) {
      charPool += lowerChars;
      guaranteed.push(lowerChars[getCryptoRandomInt(lowerChars.length)]);
    }
    if (includeNumbers) {
      charPool += numberChars;
      guaranteed.push(numberChars[getCryptoRandomInt(numberChars.length)]);
    }
    if (includeSymbols) {
      charPool += symbolChars;
      guaranteed.push(symbolChars[getCryptoRandomInt(symbolChars.length)]);
    }

    if (!charPool) {
      charPool = lowerChars;
      guaranteed.push(lowerChars[getCryptoRandomInt(lowerChars.length)]);
    }

    const generated = [...guaranteed];
    for (let i = guaranteed.length; i < length; i++) {
      generated.push(charPool[getCryptoRandomInt(charPool.length)]);
    }

    // Shuffle using Fisher-Yates with crypto random
    for (let i = generated.length - 1; i > 0; i--) {
      const j = getCryptoRandomInt(i + 1);
      [generated[i], generated[j]] = [generated[j], generated[i]];
    }

    return generated.join('');
  }, [
    mode, length, includeUpper, includeLower, includeNumbers, includeSymbols,
    excludeAmbiguous, wordCount, separator, capitalizeWords, includeNumberInPassphrase
  ]);

  const handleGenerate = useCallback(() => {
    const main = generateSinglePassword();
    setCurrentPassword(main);
    setCopied(false);

    if (batchCount > 1) {
      const batch = [];
      for (let i = 0; i < batchCount; i++) {
        batch.push(generateSinglePassword());
      }
      setBatchPasswords(batch);
    } else {
      setBatchPasswords([]);
    }
  }, [generateSinglePassword, batchCount]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleCopy = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Entropy Calculation
  const calculateEntropy = () => {
    if (!currentPassword) return { bits: 0, label: 'None', color: '#64748b', time: 'Instant' };
    
    let poolSize = 0;
    if (mode === 'passphrase') {
      poolSize = WORD_LIST.length;
      const bits = Math.round(wordCount * Math.log2(poolSize) + (includeNumberInPassphrase ? Math.log2(100) : 0));
      return getStrengthLevel(bits);
    }

    if (/[a-z]/.test(currentPassword)) poolSize += 26;
    if (/[A-Z]/.test(currentPassword)) poolSize += 26;
    if (/[0-9]/.test(currentPassword)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(currentPassword)) poolSize += 30;

    const bits = Math.round(currentPassword.length * Math.log2(Math.max(2, poolSize)));
    return getStrengthLevel(bits);
  };

  const getStrengthLevel = (bits) => {
    if (bits < 40) return { bits, label: 'Weak', color: '#ef4444', percent: 25, time: 'Seconds' };
    if (bits < 60) return { bits, label: 'Fair', color: '#f59e0b', percent: 50, time: 'Few Days' };
    if (bits < 80) return { bits, label: 'Strong', color: '#3b82f6', percent: 75, time: 'Centuries' };
    return { bits, label: 'Very Strong', color: '#10b981', percent: 100, time: 'Trillions of Years' };
  };

  const strength = calculateEntropy();

  const faqs = [
    {
      question: "Are passwords generated by this tool safe to use?",
      answer: "Yes, 100% safe. This tool uses the browser's native window.crypto.getRandomValues() API, which provides cryptographically strong pseudo-random numbers suitable for high-security applications, keys, and master passwords."
    },
    {
      question: "Are my generated passwords sent to any server?",
      answer: "Never. Everything runs completely inside your browser sandbox. No server requests, analytics logging, or remote calls ever occur when generating passwords."
    },
    {
      question: "What is the difference between a Random Password and a Passphrase?",
      answer: "A random password combines mixed characters, numbers, and symbols into a compact string (ideal for password managers). A passphrase strings together dictionary words (like 'Valley-Harbor-Falcon-74'), making it easy to remember and type on mobile devices while offering immense entropy."
    },
    {
      question: "What is password entropy?",
      answer: "Entropy measures the unpredictability of a password in bits. Higher entropy means a brute-force attacker needs exponentially more computational power and time to guess your secret."
    }
  ];

  const structuredData = [
    {
      "@type": "WebApplication",
      "name": "Strong Password & Passphrase Generator - DevToolBox",
      "url": "https://tools.trendbit.lol/tools/password-generator",
      "description": "Free cryptographically secure password and passphrase generator with entropy calculation and zero server tracking.",
      "applicationCategory": "SecurityApplication",
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
          "name": "Password Generator",
          "item": "https://tools.trendbit.lol/tools/password-generator"
        }
      ]
    }
  ];

  return (
    <div className="password-gen-page">
      <SEOHead
        title="Strong Password Generator — Secure Random Passwords & Passphrases (Free)"
        description="Generate cryptographically secure passwords and memorable passphrases with entropy score, customizable symbols, length controls, and 100% client-side privacy."
        keywords="password generator, strong password generator, random password, passphrase generator, secure password generator, generate password online, diceware"
        canonicalUrl="/tools/password-generator"
        structuredData={structuredData}
        faqData={faqs}
      />

      <div className="pg-header">
        <h1>Strong Password & Passphrase Generator</h1>
        <p className="pg-subtitle">
          Generate cryptographically strong passwords and memorable passphrases with instant entropy analysis. 100% client-side security with zero server tracking.
        </p>
      </div>

      <div className="pg-workspace">
        {/* Output Hero Display */}
        <div className="pg-display-box">
          <div className="pg-password-text" title="Generated Password">
            {currentPassword || 'Generating...'}
          </div>
          <div className="pg-display-actions">
            <button
              className={`pg-btn pg-copy-btn ${copied ? 'copied' : ''}`}
              onClick={() => handleCopy(currentPassword)}
              aria-label="Copy password to clipboard"
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            <button
              className="pg-btn pg-refresh-btn"
              onClick={handleGenerate}
              aria-label="Generate new password"
            >
              🔄 Regenerate
            </button>
          </div>
        </div>

        {/* Strength & Entropy Indicator */}
        <div className="pg-strength-bar-container">
          <div className="pg-strength-info">
            <span>Strength: <strong style={{ color: strength.color }}>{strength.label}</strong></span>
            <span>Entropy: <strong>{strength.bits} bits</strong></span>
            <span>Crack Time: <strong>~{strength.time}</strong></span>
          </div>
          <div className="pg-bar-track">
            <div
              className="pg-bar-fill"
              style={{ width: `${strength.percent}%`, backgroundColor: strength.color }}
            />
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="pg-tabs">
          <button
            className={`pg-tab-btn ${mode === 'password' ? 'active' : ''}`}
            onClick={() => setMode('password')}
          >
            🔑 Random Password
          </button>
          <button
            className={`pg-tab-btn ${mode === 'passphrase' ? 'active' : ''}`}
            onClick={() => setMode('passphrase')}
          >
            📖 Memorable Passphrase
          </button>
        </div>

        {/* Controls Panel */}
        <div className="pg-controls-card">
          {mode === 'password' ? (
            <div className="pg-options-grid">
              <div className="pg-slider-group">
                <div className="pg-slider-header">
                  <label htmlFor="pg-length-slider">Password Length:</label>
                  <span className="pg-slider-value">{length} characters</span>
                </div>
                <input
                  id="pg-length-slider"
                  type="range"
                  min="6"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="pg-range-input"
                />
              </div>

              <div className="pg-checkboxes-grid">
                <label className="pg-checkbox-item">
                  <input
                    type="checkbox"
                    checked={includeUpper}
                    onChange={(e) => setIncludeUpper(e.target.checked)}
                  />
                  <span>Uppercase (A-Z)</span>
                </label>

                <label className="pg-checkbox-item">
                  <input
                    type="checkbox"
                    checked={includeLower}
                    onChange={(e) => setIncludeLower(e.target.checked)}
                  />
                  <span>Lowercase (a-z)</span>
                </label>

                <label className="pg-checkbox-item">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                  />
                  <span>Numbers (0-9)</span>
                </label>

                <label className="pg-checkbox-item">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                  />
                  <span>Symbols (!@#$%)</span>
                </label>

                <label className="pg-checkbox-item">
                  <input
                    type="checkbox"
                    checked={excludeAmbiguous}
                    onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  />
                  <span>Exclude Ambiguous (1, l, I, 0, O)</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="pg-options-grid">
              <div className="pg-slider-group">
                <div className="pg-slider-header">
                  <label htmlFor="pg-words-slider">Number of Words:</label>
                  <span className="pg-slider-value">{wordCount} words</span>
                </div>
                <input
                  id="pg-words-slider"
                  type="range"
                  min="3"
                  max="8"
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                  className="pg-range-input"
                />
              </div>

              <div className="pg-passphrase-options">
                <div className="pg-select-group">
                  <label htmlFor="pg-separator-select">Word Separator:</label>
                  <select
                    id="pg-separator-select"
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value)}
                    className="pg-select-input"
                  >
                    <option value="-">Hyphen (-)</option>
                    <option value="_">Underscore (_)</option>
                    <option value=".">Period (.)</option>
                    <option value=" ">Space ( )</option>
                    <option value="#">Hash (#)</option>
                  </select>
                </div>

                <div className="pg-checkboxes-grid">
                  <label className="pg-checkbox-item">
                    <input
                      type="checkbox"
                      checked={capitalizeWords}
                      onChange={(e) => setCapitalizeWords(e.target.checked)}
                    />
                    <span>Capitalize Each Word</span>
                  </label>

                  <label className="pg-checkbox-item">
                    <input
                      type="checkbox"
                      checked={includeNumberInPassphrase}
                      onChange={(e) => setIncludeNumberInPassphrase(e.target.checked)}
                    />
                    <span>Append Random Number</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Batch Generation Options */}
          <div className="pg-batch-row">
            <label htmlFor="pg-batch-select">Batch Quantity:</label>
            <select
              id="pg-batch-select"
              value={batchCount}
              onChange={(e) => setBatchCount(parseInt(e.target.value))}
              className="pg-batch-select"
            >
              <option value="1">1 Password</option>
              <option value="5">Generate 5 Passwords</option>
              <option value="10">Generate 10 Passwords</option>
            </select>
          </div>
        </div>

        {/* Batch Results View */}
        {batchPasswords.length > 0 && (
          <div className="pg-batch-results">
            <h3>Batch Results ({batchPasswords.length})</h3>
            <div className="pg-batch-list">
              {batchPasswords.map((pwd, idx) => (
                <div key={idx} className="pg-batch-item">
                  <span className="pg-batch-text">{pwd}</span>
                  <button
                    className="pg-btn pg-batch-copy-btn"
                    onClick={() => handleCopy(pwd)}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AdBanner slot="password-gen-bottom" format="horizontal" />

      {/* Educational & SEO Content */}
      <section className="tool-seo-content">
        <h2>About Our Free Strong Password & Passphrase Generator</h2>
        <p>
          The DevToolBox <strong>Strong Password Generator</strong> is an essential cybersecurity tool built to defend against 
          credential stuffing, dictionary attacks, and automated brute-force attempts. Powered completely by 
          <strong> Web Crypto API (<code>window.crypto.getRandomValues</code>)</strong>, all random byte selections occur strictly 
          inside your client-side browser memory.
        </p>

        <h3>Why Cryptographic Entropy Matters</h3>
        <p>
          Weak passwords relying on predictable names, birthdays, or standard dictionary terms can be cracked in seconds using 
          modern GPU clusters. A 16-character random password containing uppercase letters, lowercase letters, numbers, and symbols 
          possesses over <strong>95 bits of entropy</strong>, requiring trillions of years to guess.
        </p>

        <h3>Frequently Asked Questions</h3>
        <div className="pg-faqs-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.05rem' }}>{faq.question}</h4>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>{faq.answer}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          Looking for other developer tools? Draft secure notes in our <Link to="/tools/notepad">Online Notepad</Link>, 
          check text lengths with our <Link to="/tools/word-counter">Word Counter</Link>, or format API responses with our <Link to="/tools/json-formatter">JSON Formatter</Link>.
        </p>
      </section>
    </div>
  );
};

export default PasswordGenerator;
