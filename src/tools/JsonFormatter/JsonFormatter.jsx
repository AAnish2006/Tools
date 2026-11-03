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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JSON Formatter - DevToolBox",
    "url": "https://tools.trendbit.lol/tools/json-formatter",
    "description": "Free online JSON formatter and validator. Format, beautify, minify, and validate JSON data.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <div className="json-page">
      <SEOHead
        title="JSON Formatter - Free Online Tool"
        description="Free online JSON formatter and validator. Format, beautify, minify, and validate JSON data with syntax highlighting. Debug APIs instantly."
        keywords="JSON formatter, JSON validator, JSON beautifier, format JSON online, JSON minifier, validate JSON, pretty print JSON, API debugging"
        canonicalUrl="/tools/json-formatter"
        structuredData={structuredData}
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
      </section>
    </div>
  );
};

export default JsonFormatter;
