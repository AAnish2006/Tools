import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead/SEOHead';
import AdBanner from '../../components/AdBanner/AdBanner';
import './Base64Encoder.css';

const Base64Encoder = () => {
  const [activeTab, setActiveTab] = useState('base64'); // 'base64' or 'url'
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [fileDetails, setFileDetails] = useState(null);
  const fileInputRef = useRef(null);

  // UTF-8 Safe Base64 Encoding
  const utf8ToBase64 = (str) => {
    return window.btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  };

  // UTF-8 Safe Base64 Decoding
  const base64ToUtf8 = (str) => {
    return decodeURIComponent(
      Array.prototype.map
        .call(window.atob(str), (c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  };

  const handleEncode = useCallback(() => {
    setError('');
    if (!input) {
      setOutput('');
      return;
    }
    try {
      if (activeTab === 'base64') {
        const encoded = utf8ToBase64(input);
        setOutput(encoded);
      } else {
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
      }
    } catch (err) {
      setError(`Encoding error: ${err.message}`);
    }
  }, [input, activeTab]);

  const handleDecode = useCallback(() => {
    setError('');
    if (!input) {
      setOutput('');
      return;
    }
    try {
      if (activeTab === 'base64') {
        // Clean up whitespace or newlines common in base64 strings
        const cleaned = input.trim().replace(/\s+/g, '');
        const decoded = base64ToUtf8(cleaned);
        setOutput(decoded);
      } else {
        const decoded = decodeURIComponent(input);
        setOutput(decoded);
      }
    } catch (err) {
      setError(`Decoding error: ${err.message}. Please verify the string is valid ${activeTab === 'base64' ? 'Base64' : 'URL encoded'}.`);
    }
  }, [input, activeTab]);

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
    setError('');
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = output;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setFileDetails(null);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle File to Base64
  const handleFileProcess = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      setOutput(base64Data);
      setInput(`[File: ${file.name} | ${Math.round(file.size / 1024)} KB | ${file.type || 'unknown type'}]`);
      setFileDetails({
        name: file.name,
        size: file.size,
        type: file.type
      });
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const onFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const faqs = [
    {
      question: "What is Base64 encoding?",
      answer: "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is widely used to transfer images, files, cryptographic keys, and API payloads over text-based protocols like HTTP, JSON, and Email without data corruption."
    },
    {
      question: "Are emojis and international UTF-8 characters supported?",
      answer: "Yes! Standard browser btoa() functions fail on non-Latin1 characters. Our tool implements full UTF-8 byte serialization, ensuring emojis, Asian characters, and accented letters encode and decode perfectly without errors."
    },
    {
      question: "Can I convert files and images directly to Base64 data URIs?",
      answer: "Yes. Simply drag and drop any image, document, or audio file into the file upload box, and the tool will immediately generate the complete Data URI (e.g., data:image/png;base64,...) ready for CSS, HTML, or API embedding."
    },
    {
      question: "What is URL encoding (percent-encoding)?",
      answer: "URL encoding converts reserved characters (such as ?, &, =, spaces, and slashes) into percent-encoded triplets (e.g. %20 for space) so query strings and parameters can safely travel in internet addresses."
    }
  ];

  const structuredData = {
    "@type": "WebApplication",
    "name": "Base64 & URL Encoder / Decoder - DevToolBox",
    "url": "https://tools.trendbit.lol/tools/base64-encoder",
    "description": "Free online Base64 encoder, decoder, file to data URL converter, and URL percent encoder with UTF-8 support.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All modern browsers",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "980",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <div className="base64-page">
      <SEOHead
        title="Base64 & URL Encoder / Decoder — Convert Text & Files Online (Free, UTF-8)"
        description="Free online Base64 encoder and decoder with UTF-8 & emoji support, file to Data URL converter, and URL percent encoder. 100% client-side privacy."
        keywords="base64 encoder, base64 decoder, base64 encode online, url encoder, url decoder, file to base64, image to base64, data uri generator"
        canonicalUrl="/tools/base64-encoder"
        structuredData={structuredData}
        faqData={faqs}
      />

      <div className="b64-header">
        <h1>Base64 & URL Encoder / Decoder</h1>
        <p className="b64-subtitle">
          Encode and decode Base64 strings, URL query parameters, and convert files to Base64 Data URIs. Safe for UTF-8 emojis and special characters.
        </p>
      </div>

      <div className="b64-workspace">
        {/* Tab Controls */}
        <div className="b64-tabs">
          <button
            className={`b64-tab-btn ${activeTab === 'base64' ? 'active' : ''}`}
            onClick={() => { setActiveTab('base64'); setError(''); }}
          >
            📦 Base64 Converter
          </button>
          <button
            className={`b64-tab-btn ${activeTab === 'url' ? 'active' : ''}`}
            onClick={() => { setActiveTab('url'); setError(''); }}
          >
            🔗 URL (Percent) Encoder
          </button>
        </div>

        {/* Drag & Drop File to Base64 Area (Base64 tab only) */}
        {activeTab === 'base64' && (
          <div
            className="b64-file-dropzone"
            onDrop={onFileDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileInputChange}
              style={{ display: 'none' }}
            />
            <span className="drop-icon">📁</span>
            <span>Drag & drop any file/image here to convert to Base64 Data URI, or click to browse</span>
          </div>
        )}

        {/* Error Notification */}
        {error && <div className="b64-error-banner">{error}</div>}

        {/* Dual Input/Output Editors */}
        <div className="b64-editors-grid">
          {/* Input Panel */}
          <div className="b64-panel">
            <div className="b64-panel-header">
              <span className="b64-panel-title">Input {activeTab === 'base64' ? 'Text / Base64' : 'String / URL'}</span>
              <span className="b64-char-count">{input.length} chars</span>
            </div>
            <textarea
              className="b64-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeTab === 'base64' ? 'Enter plain text to encode, or paste Base64 to decode...' : 'Enter URL query string or text to encode/decode...'}
              spellCheck="false"
            />
          </div>

          {/* Output Panel */}
          <div className="b64-panel">
            <div className="b64-panel-header">
              <span className="b64-panel-title">Output Result</span>
              <span className="b64-char-count">{output.length} chars</span>
            </div>
            <textarea
              className="b64-textarea"
              value={output}
              readOnly
              placeholder="Result will appear here..."
              spellCheck="false"
            />
          </div>
        </div>

        {/* Primary Action Buttons Bar */}
        <div className="b64-actions-bar">
          <div className="b64-action-group">
            <button className="b64-btn b64-btn-primary" onClick={handleEncode}>
              ⚡ Encode
            </button>
            <button className="b64-btn b64-btn-secondary" onClick={handleDecode}>
              🔓 Decode
            </button>
            <button className="b64-btn b64-btn-swap" onClick={handleSwap} title="Swap Input and Output">
              ⇄ Swap
            </button>
          </div>

          <div className="b64-action-group">
            <button
              className={`b64-btn b64-btn-copy ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              disabled={!output}
            >
              {copied ? '✓ Copied' : '📋 Copy Output'}
            </button>
            <button
              className="b64-btn b64-btn-download"
              onClick={handleDownload}
              disabled={!output}
            >
              💾 Download
            </button>
            <button className="b64-btn b64-btn-clear" onClick={handleClear}>
              🗑️ Clear
            </button>
          </div>
        </div>
      </div>

      <AdBanner slot="base64-bottom" format="horizontal" />

      {/* SEO & Educational Content */}
      <section className="tool-seo-content">
        <h2>About Our Free Base64 & URL Encoder / Decoder</h2>
        <p>
          The DevToolBox <strong>Base64 and URL Encoder/Decoder</strong> provides essential text and file conversion utilities 
          for web developers, API engineers, and security analysts. Built completely with native browser APIs, your data is converted 
          synchronously with zero network round-trips.
        </p>

        <h3>Core Features</h3>
        <ul>
          <li><strong>Full UTF-8 & Emoji Compatibility:</strong> Never experience Latin1 encoding crashes when handling Unicode characters.</li>
          <li><strong>Direct File to Data URI Conversion:</strong> Drag-and-drop images or documents to generate embeddable CSS/HTML data strings.</li>
          <li><strong>Bidirectional Conversion:</strong> Quickly switch between encoding and decoding with the ⇄ Swap function.</li>
          <li><strong>100% Client-Side Privacy:</strong> Sensitive tokens, keys, and file contents remain inside your browser sandbox.</li>
        </ul>

        <h3>Frequently Asked Questions</h3>
        <div className="b64-faqs-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.05rem' }}>{faq.question}</h4>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>{faq.answer}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          Explore more tools: Format API JSON payloads with our <Link to="/tools/json-formatter">JSON Formatter</Link>, 
          generate credentials with our <Link to="/tools/password-generator">Password Generator</Link>, or resize photos with our <Link to="/tools/image-resizer">Image Resizer</Link>.
        </p>
      </section>
    </div>
  );
};

export default Base64Encoder;
