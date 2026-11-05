import { useState, useEffect, useCallback, useId } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead/SEOHead';
import AdBanner from '../../components/AdBanner/AdBanner';
import './UuidGenerator.css';

const UuidGenerator = () => {
  const [activeTab, setActiveTab] = useState('uuid'); // 'uuid' or 'timestamp'
  
  // UUID Settings
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [includeHyphens, setIncludeHyphens] = useState(true);
  const [brackets, setBrackets] = useState('none'); // 'none', 'braces', 'quotes'
  const [outputFormat, setOutputFormat] = useState('list'); // 'list' or 'json'
  const [uuids, setUuids] = useState([]);
  const [copied, setCopied] = useState(false);

  // Timestamp Settings
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [inputEpoch, setInputEpoch] = useState(Math.floor(Date.now() / 1000).toString());
  const [inputDate, setInputDate] = useState(new Date().toISOString().slice(0, 16));
  const [epochResult, setEpochResult] = useState('');
  const [dateResult, setDateResult] = useState('');

  // Live Epoch Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate cryptographically secure UUID v4
  const generateSingleUuid = useCallback(() => {
    let id;
    if (typeof window.crypto?.randomUUID === 'function') {
      id = window.crypto.randomUUID();
    } else {
      // RFC 4122 v4 Fallback using crypto.getRandomValues
      const bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 1
      id = [...bytes].map((b, i) => {
        const hex = b.toString(16).padStart(2, '0');
        return (i === 4 || i === 6 || i === 8 || i === 10) ? `-${hex}` : hex;
      }).join('');
    }

    if (!includeHyphens) {
      id = id.replace(/-/g, '');
    }
    if (uppercase) {
      id = id.toUpperCase();
    }
    if (brackets === 'braces') {
      id = `{${id}}`;
    } else if (brackets === 'quotes') {
      id = `"${id}"`;
    }

    return id;
  }, [includeHyphens, uppercase, brackets]);

  const handleGenerateUuids = useCallback(() => {
    const list = [];
    for (let i = 0; i < quantity; i++) {
      list.push(generateSingleUuid());
    }
    setUuids(list);
    setCopied(false);
  }, [quantity, generateSingleUuid]);

  useEffect(() => {
    handleGenerateUuids();
  }, [handleGenerateUuids]);

  const formattedOutput = outputFormat === 'json' 
    ? JSON.stringify(uuids, null, 2)
    : uuids.join('\n');

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

  const handleDownload = () => {
    const ext = outputFormat === 'json' ? 'json' : 'txt';
    const mime = outputFormat === 'json' ? 'application/json' : 'text/plain';
    const blob = new Blob([formattedOutput], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${new Date().toISOString().slice(0, 10)}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Timestamp conversion logic
  const handleConvertEpochToDate = () => {
    const num = parseInt(inputEpoch, 10);
    if (isNaN(num)) {
      setEpochResult('Invalid Unix Epoch timestamp');
      return;
    }
    // Detect whether user entered seconds (10 digits) or milliseconds (13 digits)
    const ms = inputEpoch.length > 11 ? num : num * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) {
      setEpochResult('Out of range timestamp');
      return;
    }
    setEpochResult(`UTC: ${d.toUTCString()}\nLocal: ${d.toLocaleString()}\nISO 8601: ${d.toISOString()}`);
  };

  const handleConvertDateToEpoch = () => {
    if (!inputDate) return;
    const d = new Date(inputDate);
    if (isNaN(d.getTime())) {
      setDateResult('Invalid date string');
      return;
    }
    const secs = Math.floor(d.getTime() / 1000);
    const ms = d.getTime();
    setDateResult(`Unix Timestamp (Seconds): ${secs}\nUnix Timestamp (Milliseconds): ${ms}`);
  };

  const faqs = [
    {
      question: "What is a UUID v4?",
      answer: "A UUID (Universally Unique Identifier) version 4 is a 128-bit label generated using cryptographically strong pseudo-random numbers. The chance of duplicate collision is virtually zero: you would need to generate 1 billion UUIDs every second for 85 years to have a 50% probability of a single collision."
    },
    {
      question: "Is this UUID generator cryptographically secure?",
      answer: "Yes, 100%. All UUIDs are generated directly in your browser using the native Web Crypto API (crypto.randomUUID() and crypto.getRandomValues()), guaranteeing OS-grade cryptographic randomness with zero network requests."
    },
    {
      question: "What is the difference between a UUID and a GUID?",
      answer: "A GUID (Globally Unique Identifier) is Microsoft's implementation of the RFC 4122 UUID standard. In practice, GUID and UUID v4 refer to the same 128-bit randomized identifier format."
    },
    {
      question: "What is a Unix Timestamp?",
      answer: "The Unix Timestamp (or Epoch) is the total number of seconds elapsed since January 1, 1970 00:00:00 UTC. It provides an unambiguous, timezone-agnostic representation of time used across databases, JWT tokens, and APIs."
    }
  ];

  const structuredData = [
    {
      "@type": "WebApplication",
      "name": "UUID / GUID Generator & Unix Timestamp Converter - DevToolBox",
      "url": "https://tools.trendbit.lol/tools/uuid-generator",
      "description": "Free online UUID v4 and GUID generator with batch generation, customizable formats, and Unix epoch timestamp converter.",
      "applicationCategory": "DeveloperApplication",
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
          "name": "UUID / GUID Generator",
          "item": "https://tools.trendbit.lol/tools/uuid-generator"
        }
      ]
    }
  ];

  return (
    <div className="uuid-page">
      <SEOHead
        title="UUID / GUID Generator Online — Free Cryptographic UUID v4 & Timestamp Tool"
        description="Free online UUID/GUID generator with bulk generation up to 100 IDs, custom hyphens, uppercase, JSON array export, and live Unix epoch timestamp converter. 100% private."
        keywords="uuid generator, guid generator, generate uuid v4, random uuid online, bulk uuid generator, unix timestamp converter, epoch converter"
        canonicalUrl="/tools/uuid-generator"
        structuredData={structuredData}
        faqData={faqs}
      />

      <div className="uuid-header">
        <h1>UUID / GUID Generator & Timestamp Converter</h1>
        <p className="uuid-subtitle">
          Generate RFC 4122 compliant UUID v4 identifiers and convert Unix timestamps. 100% cryptographically random in your browser with zero server transmission.
        </p>
      </div>

      <div className="uuid-workspace">
        {/* Tab Controls */}
        <div className="uuid-tabs">
          <button
            className={`uuid-tab-btn ${activeTab === 'uuid' ? 'active' : ''}`}
            onClick={() => setActiveTab('uuid')}
          >
            🆔 UUID / GUID Generator
          </button>
          <button
            className={`uuid-tab-btn ${activeTab === 'timestamp' ? 'active' : ''}`}
            onClick={() => setActiveTab('timestamp')}
          >
            ⏱️ Unix Epoch Timestamp
          </button>
        </div>

        {activeTab === 'uuid' ? (
          <>
            {/* Options Panel */}
            <div className="uuid-controls-panel">
              <div className="uuid-options-grid">
                <div className="uuid-control-group">
                  <label htmlFor="uuid-qty-select">Quantity to Generate:</label>
                  <select
                    id="uuid-qty-select"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    className="uuid-select"
                  >
                    <option value="1">1 UUID</option>
                    <option value="5">5 UUIDs</option>
                    <option value="10">10 UUIDs</option>
                    <option value="25">25 UUIDs</option>
                    <option value="50">50 UUIDs</option>
                    <option value="100">100 UUIDs</option>
                  </select>
                </div>

                <div className="uuid-control-group">
                  <label htmlFor="uuid-brackets-select">Enclosure / Brackets:</label>
                  <select
                    id="uuid-brackets-select"
                    value={brackets}
                    onChange={(e) => setBrackets(e.target.value)}
                    className="uuid-select"
                  >
                    <option value="none">None (Standard)</option>
                    <option value="braces">{'{ ... }'} Braces</option>
                    <option value="quotes">" ... " Quotes</option>
                  </select>
                </div>

                <div className="uuid-control-group">
                  <label htmlFor="uuid-format-select">Output Format:</label>
                  <select
                    id="uuid-format-select"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="uuid-select"
                  >
                    <option value="list">Plain Text List</option>
                    <option value="json">JSON Array</option>
                  </select>
                </div>
              </div>

              <div className="uuid-checkboxes-row">
                <label className="uuid-checkbox-item">
                  <input
                    type="checkbox"
                    checked={uppercase}
                    onChange={(e) => setUppercase(e.target.checked)}
                  />
                  <span>Uppercase (A-F)</span>
                </label>

                <label className="uuid-checkbox-item">
                  <input
                    type="checkbox"
                    checked={includeHyphens}
                    onChange={(e) => setIncludeHyphens(e.target.checked)}
                  />
                  <span>Include Hyphens (36 characters)</span>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className="uuid-results-panel">
              <div className="uuid-results-header">
                <span>Generated Identifiers ({uuids.length})</span>
                <span className="uuid-type-badge">Version 4 (Cryptographic)</span>
              </div>
              <textarea
                className="uuid-textarea"
                value={formattedOutput}
                readOnly
                rows={Math.min(12, Math.max(5, uuids.length + 2))}
                spellCheck="false"
              />
            </div>

            {/* Actions Bar */}
            <div className="uuid-actions-bar">
              <button
                className="uuid-btn uuid-btn-primary"
                onClick={handleGenerateUuids}
              >
                🔄 Regenerate
              </button>
              <button
                className={`uuid-btn uuid-btn-copy ${copied ? 'copied' : ''}`}
                onClick={() => handleCopy(formattedOutput)}
              >
                {copied ? '✓ Copied All' : '📋 Copy All'}
              </button>
              <button
                className="uuid-btn uuid-btn-download"
                onClick={handleDownload}
              >
                💾 Download File
              </button>
            </div>
          </>
        ) : (
          /* Unix Timestamp Tools */
          <div className="epoch-tools-container">
            {/* Live Epoch Ticker */}
            <div className="epoch-live-card">
              <span className="epoch-live-label">Current Unix Epoch Time:</span>
              <span className="epoch-live-value">{currentTimestamp}</span>
              <button
                className="uuid-btn-small"
                onClick={() => handleCopy(currentTimestamp.toString())}
              >
                Copy
              </button>
            </div>

            <div className="epoch-converters-grid">
              {/* Epoch to Date */}
              <div className="epoch-card">
                <h3>Convert Unix Epoch to Date</h3>
                <div className="epoch-input-group">
                  <label htmlFor="epoch-input">Enter Timestamp (seconds or ms):</label>
                  <input
                    id="epoch-input"
                    type="text"
                    value={inputEpoch}
                    onChange={(e) => setInputEpoch(e.target.value)}
                    placeholder="e.g. 1730700000"
                    className="epoch-input"
                  />
                  <button className="uuid-btn uuid-btn-primary" onClick={handleConvertEpochToDate}>
                    Convert to Date
                  </button>
                </div>
                {epochResult && (
                  <pre className="epoch-result-box">{epochResult}</pre>
                )}
              </div>

              {/* Date to Epoch */}
              <div className="epoch-card">
                <h3>Convert Date to Unix Epoch</h3>
                <div className="epoch-input-group">
                  <label htmlFor="date-input">Select Date and Time:</label>
                  <input
                    id="date-input"
                    type="datetime-local"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    className="epoch-input"
                  />
                  <button className="uuid-btn uuid-btn-primary" onClick={handleConvertDateToEpoch}>
                    Convert to Timestamp
                  </button>
                </div>
                {dateResult && (
                  <pre className="epoch-result-box">{dateResult}</pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AdBanner slot="uuid-bottom" format="horizontal" />

      {/* SEO & Educational Content */}
      <section className="tool-seo-content">
        <h2>About Our Free UUID v4 Generator & Unix Timestamp Converter</h2>
        <p>
          The DevToolBox <strong>UUID Generator</strong> provides fast, cryptographically random RFC 4122 Version 4 
          identifiers for developers, system architects, and QA engineers. All identifiers are generated using modern 
          browser Web Crypto primitives, ensuring zero duplicates, complete privacy, and no network delays.
        </p>

        <h3>Common Use Cases</h3>
        <ul>
          <li><strong>Database Primary Keys:</strong> Distributed SQL (CockroachDB, PostgreSQL) and NoSQL (MongoDB) records.</li>
          <li><strong>API Tracing & Correlation IDs:</strong> Tracking microservice HTTP requests across distributed logs.</li>
          <li><strong>Mock Testing Data:</strong> Populating test suites and staging databases with valid, non-colliding entities.</li>
          <li><strong>Unix Epoch Analysis:</strong> Translating server logs, database timestamps, and JWT token expirations.</li>
        </ul>

        <h3>Frequently Asked Questions</h3>
        <div className="uuid-faqs-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: '700' }}>{faq.question}</h4>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>{faq.answer}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          Check out our other developer utilities: Generate passwords with our <Link to="/tools/password-generator">Password Generator</Link>, 
          validate API payloads with our <Link to="/tools/json-formatter">JSON Formatter</Link>, or encode data with our <Link to="/tools/base64-encoder">Base64 Encoder</Link>.
        </p>
      </section>
    </div>
  );
};

export default UuidGenerator;
