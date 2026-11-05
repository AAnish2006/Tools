import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead/SEOHead';
import AdBanner from '../../components/AdBanner/AdBanner';
import './JsonFormatter.css';

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [isValid, setIsValid] = useState(null);

  const formatJSON = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      setIsValid(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indentSize));
      setError('');
      setIsValid(true);
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
      setOutput('');
      setIsValid(false);
    }
  }, [input, indentSize]);

  const minifyJSON = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
      setIsValid(true);
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
      setOutput('');
      setIsValid(false);
    }
  }, [input]);

  const handleCopy = useCallback(async () => {
    const textToCopy = output || input;
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }, [output, input]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setIsValid(null);
  };

  const handleSample = () => {
    const sample = JSON.stringify({
      "name": "DevToolBox",
      "version": "1.0.0",
      "tools": ["notepad", "word-counter", "json-formatter"],
      "features": {
        "autoSave": true,
        "darkMode": true,
        "responsive": true
      },
      "stats": {
        "users": 50000,
        "rating": 4.8
      }
    });
    setInput(sample);
    setOutput('');
    setError('');
    setIsValid(null);
  };

  const handleDownload = useCallback(() => {
    const content = output || input;
    if (!content) return;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, input]);

  const jsonFaqs = [
    {
      question: "Is my JSON payload sent to any backend server?",
      answer: "No. All JSON parsing, formatting, validation, and minification happen 100% in-browser using standard native JSON engine APIs. Your sensitive API payloads, keys, and tokens never touch the network."
    },
    {
      question: "Can I validate and format invalid JSON?",
      answer: "If your JSON has syntax errors (such as missing quotes, trailing commas, or unclosed brackets), our validator pinpoints the exact syntax error message so you can fix it immediately."
    },
    {
      question: "What is the difference between Beautify and Minify?",
      answer: "Beautify formats compact JSON into easily readable lines with 2, 4, or 8 space indentation. Minify strips all unnecessary whitespace and line breaks to minimize payload size for production deployment."
    }
  ];

  const structuredData = [
    {
      "@type": "WebApplication",
      "name": "JSON Formatter & Validator - DevToolBox",
      "url": "https://tools.trendbit.lol/tools/json-formatter",
      "description": "Free online JSON formatter, validator, and beautifier with error detection and minification. 100% client-side privacy.",
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
          "name": "JSON Formatter",
          "item": "https://tools.trendbit.lol/tools/json-formatter"
        }
      ]
    }
  ];

  return (
    <div className="json-page">
      <SEOHead
        title="JSON Formatter & Validator — Beautify & Minify JSON Online (100% Private)"
        description="Free online JSON formatter, validator, and beautifier. Validate JSON syntax, pretty print with indentation, minify for production, and debug APIs with zero server uploads."
        keywords="JSON formatter, JSON validator, JSON beautifier, format JSON online, JSON minifier, validate JSON, pretty print JSON, API debugging"
        canonicalUrl="/tools/json-formatter"
        structuredData={structuredData}
        faqData={jsonFaqs}
      />

      <div className="json-header">
        <h1>JSON Formatter & Validator</h1>
        <p className="json-subtitle">
          Format, validate, beautify, and minify JSON data instantly. Free online tool for developers.
        </p>
      </div>

      <div className="json-toolbar">
        <div className="toolbar-left">
          <button onClick={formatJSON} className="toolbar-btn toolbar-btn-primary">✨ Format</button>
          <button onClick={minifyJSON} className="toolbar-btn">📦 Minify</button>
          <button onClick={handleCopy} className="toolbar-btn">📋 Copy</button>
          <button onClick={handleDownload} className="toolbar-btn">💾 Download</button>
          <button onClick={handleSample} className="toolbar-btn">📄 Sample</button>
          <button onClick={handleClear} className="toolbar-btn toolbar-btn-danger">🗑️ Clear</button>
        </div>
        <div className="toolbar-right">
          <label className="indent-control">
            Indent:
            <select value={indentSize} onChange={(e) => setIndentSize(parseInt(e.target.value))}>
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
              <option value={1}>Tab</option>
            </select>
          </label>
          {isValid !== null && (
            <span className={`validation-badge ${isValid ? 'valid' : 'invalid'}`}>
              {isValid ? '✓ Valid JSON' : '✗ Invalid'}
            </span>
          )}
        </div>
      </div>

      <div className="json-editor-grid">
        <div className="json-panel">
          <label className="panel-label">Input</label>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setIsValid(null);
              setError('');
            }}
            placeholder='Paste your JSON here, e.g., {"key": "value"}'
            spellCheck="false"
            aria-label="JSON input"
          />
        </div>
        <div className="json-panel">
          <label className="panel-label">Output</label>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            spellCheck="false"
            aria-label="JSON output"
          />
        </div>
      </div>

      {error && (
        <div className="json-error" role="alert">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <AdBanner slot="json-bottom" format="rectangle" />

      <section className="tool-seo-content">
        <h2>About Our Free JSON Formatter</h2>
        <p>
          The DevToolBox <strong>JSON Formatter</strong> is a powerful, free online tool for formatting, validating, 
          beautifying, and minifying JSON data. It's perfect for debugging API responses, editing configuration files, 
          and working with structured data.
        </p>
        <h3>What You Can Do</h3>
        <ul>
          <li><strong>Format/Beautify:</strong> Transform compact JSON into readable, indented format</li>
          <li><strong>Validate:</strong> Check if your JSON is valid with clear error messages</li>
          <li><strong>Minify:</strong> Compress JSON by removing whitespace for production use</li>
          <li><strong>Copy & Download:</strong> Copy to clipboard or download as a .json file</li>
          <li><strong>Custom Indentation:</strong> Choose 2, 4, or 8 spaces for indentation</li>
        </ul>
        <h3>Common Use Cases</h3>
        <p>
          Developers use our JSON formatter for debugging REST API responses, formatting MongoDB documents, 
          editing package.json files, and preparing JSON payloads for testing. All processing happens in your 
          browser — your data is never sent to any server.
        </p>
        <p>
          Need to take quick notes while debugging? Try our <Link to="/tools/notepad">Online Notepad</Link>. 
          Writing API documentation? Use our <Link to="/tools/word-counter">Word Counter</Link> to keep your 
          docs concise. Visit our <Link to="/blog">blog</Link> for developer tips and tutorials.
        </p>

        <h3>Frequently Asked Questions</h3>
        <div className="json-faqs-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {jsonFaqs.map((faq, i) => (
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

export default JsonFormatter;
