import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead/SEOHead';
import AdBanner from '../../components/AdBanner/AdBanner';
import './ColorConverter.css';

// Helper: Convert HEX to RGB {r, g, b}
function hexToRgb(hex) {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  if (cleaned.length !== 6) return null;
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Helper: Convert RGB to HEX
function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Helper: Convert RGB to HSL {h, s, l}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Helper: Convert HSL to RGB {r, g, b}
function hslToRgb(h, s, l) {
  h = (h % 360) / 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
  };
}

// Helper: Calculate WCAG relative luminance
function getRelativeLuminance(r, g, b) {
  const sRGB = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

// Helper: Calculate contrast ratio between two RGB colors
function getContrastRatio(rgb1, rgb2) {
  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const ColorConverter = () => {
  const [activeTab, setActiveTab] = useState('converter'); // 'converter' or 'contrast'

  // Primary Color Converter States
  const [hexInput, setHexInput] = useState('#2563EB');
  const [rgbInput, setRgbInput] = useState('37, 99, 235');
  const [hslInput, setHslInput] = useState('221, 83%, 53%');
  const [currentColor, setCurrentColor] = useState('#2563EB');
  const [copyFeedback, setCopyFeedback] = useState('');

  // Contrast Checker States
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#0F172A');
  const [customSampleText, setCustomSampleText] = useState('The quick brown fox jumps over the lazy dog.');

  // Synchronize on hex changes
  const updateFromHex = useCallback((hex) => {
    setCurrentColor(hex);
    setHexInput(hex);
    const rgb = hexToRgb(hex);
    if (rgb) {
      setRgbInput(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHslInput(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);
    }
  }, []);

  const handleHexChange = (val) => {
    setHexInput(val);
    if (/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
      const formatted = val.startsWith('#') ? val : `#${val}`;
      updateFromHex(formatted);
    }
  };

  const handleRgbChange = (val) => {
    setRgbInput(val);
    const parts = val.split(',').map(s => parseInt(s.trim(), 10));
    if (parts.length === 3 && parts.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
      const hex = rgbToHex(parts[0], parts[1], parts[2]);
      setCurrentColor(hex);
      setHexInput(hex);
      const hsl = rgbToHsl(parts[0], parts[1], parts[2]);
      setHslInput(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);
    }
  };

  const handleHslChange = (val) => {
    setHslInput(val);
    const parts = val.replace(/%/g, '').split(',').map(s => parseFloat(s.trim()));
    if (parts.length === 3 && parts.every(n => !isNaN(n))) {
      const rgb = hslToRgb(parts[0], parts[1], parts[2]);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setCurrentColor(hex);
      setHexInput(hex);
      setRgbInput(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  };

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(''), 1800);
    } catch {
      // Fallback
    }
  };

  // Generate Shades and Tints
  const palette = useMemo(() => {
    const rgb = hexToRgb(currentColor) || { r: 37, g: 99, b: 235 };
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    const tints = [];
    const shades = [];

    for (let i = 1; i <= 5; i++) {
      // Tints (lighter)
      const lTint = Math.min(95, hsl.l + i * 8);
      const rgbTint = hslToRgb(hsl.h, hsl.s, lTint);
      tints.push(rgbToHex(rgbTint.r, rgbTint.g, rgbTint.b));

      // Shades (darker)
      const lShade = Math.max(5, hsl.l - i * 8);
      const rgbShade = hslToRgb(hsl.h, hsl.s, lShade);
      shades.push(rgbToHex(rgbShade.r, rgbShade.g, rgbShade.b));
    }

    // Harmonies
    const compHue = (hsl.h + 180) % 360;
    const compRgb = hslToRgb(compHue, hsl.s, hsl.l);
    const complementary = rgbToHex(compRgb.r, compRgb.g, compRgb.b);

    const ana1Hue = (hsl.h + 30) % 360;
    const ana1Rgb = hslToRgb(ana1Hue, hsl.s, hsl.l);
    const analogous1 = rgbToHex(ana1Rgb.r, ana1Rgb.g, ana1Rgb.b);

    const ana2Hue = (hsl.h + 330) % 360;
    const ana2Rgb = hslToRgb(ana2Hue, hsl.s, hsl.l);
    const analogous2 = rgbToHex(ana2Rgb.r, ana2Rgb.g, ana2Rgb.b);

    return { tints, shades, complementary, analogous1, analogous2 };
  }, [currentColor]);

  // Contrast Calculation
  const contrastInfo = useMemo(() => {
    const fg = hexToRgb(textColor) || { r: 255, g: 255, b: 255 };
    const bg = hexToRgb(bgColor) || { r: 15, g: 23, b: 42 };
    const ratio = getContrastRatio(fg, bg);
    const formattedRatio = (Math.round(ratio * 100) / 100).toFixed(2);

    return {
      ratio: formattedRatio,
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3.0,
      aaaNormal: ratio >= 7.0,
      aaaLarge: ratio >= 4.5
    };
  }, [textColor, bgColor]);

  const faqs = [
    {
      question: "How do I convert HEX to RGB or HSL?",
      answer: "Enter your 6-character or 3-character HEX code (e.g. #2563EB or #F00) in the input or use the color picker. Our tool synchronously calculates the equivalent RGB decimal triplets (rgb(37, 99, 235)) and HSL percentages (hsl(221, 83%, 53%)) in real time."
    },
    {
      question: "What is WCAG 2.1 color contrast compliance?",
      answer: "The Web Content Accessibility Guidelines (WCAG) require sufficient contrast between text and background colors for readability. Level AA requires a minimum ratio of 4.5:1 for normal body text and 3:1 for large text (18pt or 14pt bold). Level AAA requires 7:1 for normal text and 4.5:1 for large text."
    },
    {
      question: "What are color tints and shades?",
      answer: "A tint is created by adding pure white to a base color (increasing lightness), while a shade is created by adding pure black (decreasing lightness). These help designers build consistent monochromatic design systems."
    },
    {
      question: "Does this tool support CSS variable export?",
      answer: "Yes! Click the 'Copy CSS' button to immediately copy production-ready CSS custom properties for your stylesheets or Tailwind configurations."
    }
  ];

  const structuredData = [
    {
      "@type": "WebApplication",
      "name": "Color Converter & WCAG Contrast Checker - DevToolBox",
      "url": "https://tools.trendbit.lol/tools/color-converter",
      "description": "Free online color converter between HEX, RGB, HSL and WCAG 2.1 accessibility contrast ratio checker with tints, shades, and palettes.",
      "applicationCategory": "DesignApplication",
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
          "name": "Color Converter & Contrast",
          "item": "https://tools.trendbit.lol/tools/color-converter"
        }
      ]
    }
  ];

  return (
    <div className="color-page">
      <SEOHead
        title="Color Converter & WCAG Contrast Checker — Free HEX, RGB & HSL Tool"
        description="Free online color converter and WCAG 2.1 accessibility contrast checker. Convert HEX to RGB and HSL, check AA/AAA compliance, and generate shades and tints. 100% private."
        keywords="color converter, hex to rgb, rgb to hex, hex to hsl, contrast checker, wcag contrast checker, color palette generator, web accessibility colors"
        canonicalUrl="/tools/color-converter"
        structuredData={structuredData}
        faqData={faqs}
      />

      <div className="color-header">
        <h1>Color Converter & WCAG Contrast Checker</h1>
        <p className="color-subtitle">
          Convert seamlessly between HEX, RGB, and HSL color formats. Audit WCAG 2.1 AA/AAA accessibility contrast compliance and generate palette shades.
        </p>
      </div>

      <div className="color-workspace">
        {/* Tab Controls */}
        <div className="color-tabs">
          <button
            className={`color-tab-btn ${activeTab === 'converter' ? 'active' : ''}`}
            onClick={() => setActiveTab('converter')}
          >
            🎨 Color Converter & Palettes
          </button>
          <button
            className={`color-tab-btn ${activeTab === 'contrast' ? 'active' : ''}`}
            onClick={() => setActiveTab('contrast')}
          >
            👁️ WCAG Contrast Checker
          </button>
        </div>

        {activeTab === 'converter' ? (
          <>
            {/* Color Hero Display */}
            <div className="color-hero-grid">
              <div
                className="color-large-preview"
                style={{ backgroundColor: currentColor }}
              >
                <input
                  type="color"
                  value={currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#2563EB'}
                  onChange={(e) => updateFromHex(e.target.value)}
                  className="color-native-picker"
                  title="Click to open color picker"
                />
              </div>

              <div className="color-values-card">
                <div className="color-value-row">
                  <span className="color-val-label">HEX:</span>
                  <input
                    type="text"
                    value={hexInput}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="color-val-input"
                  />
                  <button
                    className="color-copy-btn"
                    onClick={() => handleCopy(hexInput, 'HEX')}
                  >
                    {copyFeedback === 'HEX' ? '✓' : 'Copy'}
                  </button>
                </div>

                <div className="color-value-row">
                  <span className="color-val-label">RGB:</span>
                  <input
                    type="text"
                    value={rgbInput}
                    onChange={(e) => handleRgbChange(e.target.value)}
                    className="color-val-input"
                  />
                  <button
                    className="color-copy-btn"
                    onClick={() => handleCopy(`rgb(${rgbInput})`, 'RGB')}
                  >
                    {copyFeedback === 'RGB' ? '✓' : 'Copy'}
                  </button>
                </div>

                <div className="color-value-row">
                  <span className="color-val-label">HSL:</span>
                  <input
                    type="text"
                    value={hslInput}
                    onChange={(e) => handleHslChange(e.target.value)}
                    className="color-val-input"
                  />
                  <button
                    className="color-copy-btn"
                    onClick={() => handleCopy(`hsl(${hslInput})`, 'HSL')}
                  >
                    {copyFeedback === 'HSL' ? '✓' : 'Copy'}
                  </button>
                </div>

                <div className="color-value-row">
                  <span className="color-val-label">CSS:</span>
                  <input
                    type="text"
                    value={`--color-primary: ${hexInput};`}
                    readOnly
                    className="color-val-input"
                  />
                  <button
                    className="color-copy-btn"
                    onClick={() => handleCopy(`--color-primary: ${hexInput};`, 'CSS')}
                  >
                    {copyFeedback === 'CSS' ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Tints & Shades */}
            <div className="color-palettes-section">
              <h3>Tints (Lighter)</h3>
              <div className="color-swatches-row">
                {palette.tints.map((c, i) => (
                  <div
                    key={i}
                    className="color-swatch-box"
                    style={{ backgroundColor: c }}
                    onClick={() => updateFromHex(c)}
                    title={`Click to pick: ${c}`}
                  >
                    <span>{c}</span>
                  </div>
                ))}
              </div>

              <h3>Shades (Darker)</h3>
              <div className="color-swatches-row">
                {palette.shades.map((c, i) => (
                  <div
                    key={i}
                    className="color-swatch-box"
                    style={{ backgroundColor: c }}
                    onClick={() => updateFromHex(c)}
                    title={`Click to pick: ${c}`}
                  >
                    <span>{c}</span>
                  </div>
                ))}
              </div>

              <h3>Harmonies & Accents</h3>
              <div className="color-swatches-row">
                <div
                  className="color-swatch-box"
                  style={{ backgroundColor: palette.complementary }}
                  onClick={() => updateFromHex(palette.complementary)}
                  title={`Complementary: ${palette.complementary}`}
                >
                  <span>Comp: {palette.complementary}</span>
                </div>
                <div
                  className="color-swatch-box"
                  style={{ backgroundColor: palette.analogous1 }}
                  onClick={() => updateFromHex(palette.analogous1)}
                  title={`Analogous: ${palette.analogous1}`}
                >
                  <span>Ana 1: {palette.analogous1}</span>
                </div>
                <div
                  className="color-swatch-box"
                  style={{ backgroundColor: palette.analogous2 }}
                  onClick={() => updateFromHex(palette.analogous2)}
                  title={`Analogous: ${palette.analogous2}`}
                >
                  <span>Ana 2: {palette.analogous2}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* WCAG Contrast Checker View */
          <div className="contrast-checker-container">
            <div className="contrast-pickers-grid">
              <div className="contrast-picker-card">
                <label>Foreground (Text) Color:</label>
                <div className="contrast-input-row">
                  <input
                    type="color"
                    value={textColor.startsWith('#') && textColor.length === 7 ? textColor : '#FFFFFF'}
                    onChange={(e) => setTextColor(e.target.value.toUpperCase())}
                    className="contrast-color-box"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="contrast-text-input"
                  />
                </div>
              </div>

              <div className="contrast-picker-card">
                <label>Background Color:</label>
                <div className="contrast-input-row">
                  <input
                    type="color"
                    value={bgColor.startsWith('#') && bgColor.length === 7 ? bgColor : '#0F172A'}
                    onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                    className="contrast-color-box"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="contrast-text-input"
                  />
                </div>
              </div>
            </div>

            {/* Score Hero Banner */}
            <div className="contrast-score-card">
              <div className="contrast-score-left">
                <span className="contrast-score-label">Contrast Ratio:</span>
                <span className="contrast-ratio-number">{contrastInfo.ratio} : 1</span>
              </div>
              <div className="contrast-badges-grid">
                <div className={`contrast-badge ${contrastInfo.aaNormal ? 'pass' : 'fail'}`}>
                  <span>WCAG AA (Normal): {contrastInfo.aaNormal ? '✓ PASS' : '✗ FAIL'}</span>
                </div>
                <div className={`contrast-badge ${contrastInfo.aaLarge ? 'pass' : 'fail'}`}>
                  <span>WCAG AA (Large): {contrastInfo.aaLarge ? '✓ PASS' : '✗ FAIL'}</span>
                </div>
                <div className={`contrast-badge ${contrastInfo.aaaNormal ? 'pass' : 'fail'}`}>
                  <span>WCAG AAA (Normal): {contrastInfo.aaaNormal ? '✓ PASS' : '✗ FAIL'}</span>
                </div>
                <div className={`contrast-badge ${contrastInfo.aaaLarge ? 'pass' : 'fail'}`}>
                  <span>WCAG AAA (Large): {contrastInfo.aaaLarge ? '✓ PASS' : '✗ FAIL'}</span>
                </div>
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div
              className="contrast-live-preview-box"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              <h3>Live Typography Preview</h3>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                Large Text (18pt / 24px Bold): {customSampleText}
              </p>
              <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                Normal Text (14pt / 16px Regular): Accessibility is essential for modern web applications. 
                Using high-contrast color pairings guarantees that your software is easily readable by users with low vision, 
                color blindness, or viewing on mobile displays in direct sunlight.
              </p>
            </div>
          </div>
        )}
      </div>

      <AdBanner slot="color-bottom" format="horizontal" />

      {/* SEO & Educational Content */}
      <section className="tool-seo-content">
        <h2>About Our Free Color Converter & WCAG Contrast Checker</h2>
        <p>
          The DevToolBox <strong>Color Converter</strong> is a comprehensive color manipulation and accessibility verification suite 
          designed for frontend developers, UI/UX designers, and digital accessibility auditors. Perform instantaneous format translations 
          and audit WCAG 2.1 compliance with zero latency directly in your browser.
        </p>

        <h3>Key Features</h3>
        <ul>
          <li><strong>Universal Color Conversion:</strong> Bidirectional conversion across HEX, RGB, HSL, and CSS custom properties.</li>
          <li><strong>WCAG 2.1 Compliance Engine:</strong> Mathematical calculation of relative luminance and AA/AAA pass/fail validation.</li>
          <li><strong>Monochromatic Palette Generation:</strong> Instant lighter tints and darker shades for comprehensive design systems.</li>
          <li><strong>Zero Tracking & 100% Client-Side:</strong> Color definitions and design tokens never travel across remote servers.</li>
        </ul>

        <h3>Frequently Asked Questions</h3>
        <div className="color-faqs-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: '700' }}>{faq.question}</h4>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>{faq.answer}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          Explore more tools: Resize photos with our <Link to="/tools/image-resizer">Image Resizer</Link>, 
          draft documents in our <Link to="/tools/markdown-previewer">Markdown Previewer</Link>, or generate keys with our <Link to="/tools/uuid-generator">UUID Generator</Link>.
        </p>
      </section>
    </div>
  );
};

export default ColorConverter;
