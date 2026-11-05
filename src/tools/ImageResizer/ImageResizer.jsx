import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead/SEOHead';
import AdBanner from '../../components/AdBanner/AdBanner';
import './ImageResizer.css';

const PRESETS = [
  { label: '50% Half Size', type: 'scale', scale: 0.5 },
  { label: '75% Size', type: 'scale', scale: 0.75 },
  { label: 'Instagram Square (1080×1080)', width: 1080, height: 1080 },
  { label: 'Instagram Story (1080×1920)', width: 1080, height: 1920 },
  { label: 'YouTube Thumbnail (1280×720)', width: 1280, height: 720 },
  { label: 'X / Twitter Post (1200×675)', width: 1200, height: 675 },
  { label: 'Facebook Post (1200×630)', width: 1200, height: 630 }
];

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ImageResizer = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [originalName, setOriginalName] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [format, setFormat] = useState('image/jpeg');
  const [quality, setQuality] = useState(90);

  const [resizedUrl, setResizedUrl] = useState(null);
  const [resizedSize, setResizedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef(null);
  const imgElementRef = useRef(null);

  // Load image file from disk
  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    setOriginalName(file.name);
    setOriginalSize(file.size);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setOriginalWidth(img.naturalWidth);
        setOriginalHeight(img.naturalHeight);
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setIsProcessing(false);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  // Dimension Change Handlers
  const handleWidthChange = (val) => {
    const newWidth = Math.max(1, parseInt(val) || 0);
    setWidth(newWidth);
    if (lockAspectRatio && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (val) => {
    const newHeight = Math.max(1, parseInt(val) || 0);
    setHeight(newHeight);
    if (lockAspectRatio && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const applyPreset = (preset) => {
    if (preset.type === 'scale') {
      const newW = Math.round(originalWidth * preset.scale);
      const newH = Math.round(originalHeight * preset.scale);
      setWidth(newW);
      setHeight(newH);
    } else {
      setWidth(preset.width);
      setHeight(preset.height);
    }
  };

  // Perform Canvas Resizing
  const processResize = useCallback(() => {
    if (!imageSrc || width <= 0 || height <= 0) return;

    setIsProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // For PNG transparency retention when switching formats
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (resizedUrl) URL.revokeObjectURL(resizedUrl);
            const url = URL.createObjectURL(blob);
            setResizedUrl(url);
            setResizedSize(blob.size);
          }
          setIsProcessing(false);
        },
        format,
        quality / 100
      );
    };
    img.src = imageSrc;
  }, [imageSrc, width, height, format, quality]);

  // Re-process on adjustments
  useEffect(() => {
    if (imageSrc && width > 0 && height > 0) {
      const debounceTimer = setTimeout(() => {
        processResize();
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [imageSrc, width, height, format, quality, processResize]);

  const handleDownload = () => {
    if (!resizedUrl) return;
    const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = resizedUrl;
    a.download = `${baseName}-${width}x${height}.${ext}`;
    a.click();
  };

  const handleReset = () => {
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setImageSrc(null);
    setResizedUrl(null);
    setOriginalName('');
    setOriginalSize(0);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setWidth(0);
    setHeight(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const imageResizerFaqs = [
    {
      question: "Are my photos uploaded to a remote server when resizing?",
      answer: "No. All resizing and format conversions occur 100% inside your browser using HTML5 Canvas. Your images are never transmitted over the internet or saved to any cloud storage."
    },
    {
      question: "Can I lock the aspect ratio while resizing?",
      answer: "Yes! The Aspect Ratio Lock is enabled by default. Changing the width automatically recalculates the height proportionally (and vice versa) to prevent your image from stretching or distorting."
    },
    {
      question: "Which formats are supported?",
      answer: "You can upload JPG, JPEG, PNG, WEBP, and SVG files, and export them into optimized JPG, PNG, or modern compressed WEBP format with customizable quality settings."
    }
  ];

  const structuredData = [
    {
      "@type": "WebApplication",
      "name": "Online Image Resizer - DevToolBox",
      "url": "https://tools.trendbit.lol/tools/image-resizer",
      "description": "Free online image resizer. Resize PNG, JPG, and WEBP images directly in your browser with custom dimensions and aspect ratio lock.",
      "applicationCategory": "MultimediaApplication",
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
          "name": "Image Resizer",
          "item": "https://tools.trendbit.lol/tools/image-resizer"
        }
      ]
    }
  ];

  const compressionPercent = originalSize > 0 && resizedSize > 0
    ? Math.round(((originalSize - resizedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="imageresizer-page">
      <SEOHead
        title="Online Image Resizer — Resize JPG, PNG & WEBP (Custom Dimensions, Free)"
        description="Free online image resizer. Resize JPG, PNG, and WEBP images in your browser with custom dimensions, social media presets, aspect ratio lock, and quality control. 100% private."
        keywords="image resizer, resize image online, resize photo, photo resizer, crop image, compress image, image dimension changer, free image resizer"
        canonicalUrl="/tools/image-resizer"
        structuredData={structuredData}
        faqData={imageResizerFaqs}
      />

      <div className="ir-header">
        <h1>Online Image Resizer</h1>
        <p className="ir-subtitle">
          Resize JPG, PNG, and WEBP images instantly in your browser. Set custom pixel dimensions, social media presets, or maintain aspect ratios with zero server uploads.
        </p>
      </div>

      {!imageSrc ? (
        <div
          className="ir-dropzone"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload an image to resize"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileInputChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <div className="dropzone-icon">🖼️</div>
          <h2>Drag & Drop your image here</h2>
          <p className="dropzone-hint">or click to browse from your computer (PNG, JPG, WEBP, SVG)</p>
          <span className="dropzone-privacy-badge">🔒 100% Client-Side: Your photo never leaves your device</span>
        </div>
      ) : (
        <div className="ir-editor-grid">
          {/* Controls Panel */}
          <div className="ir-controls-panel">
            <div className="ir-panel-section">
              <h3>Image Dimensions (Pixels)</h3>
              <div className="dimension-inputs-row">
                <div className="input-group">
                  <label htmlFor="ir-width">Width</label>
                  <input
                    id="ir-width"
                    type="number"
                    min="1"
                    max="10000"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                  />
                  <span className="unit-label">px</span>
                </div>

                <button
                  type="button"
                  className={`btn-lock-aspect ${lockAspectRatio ? 'locked' : ''}`}
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  title={lockAspectRatio ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                >
                  {lockAspectRatio ? '🔒' : '🔓'}
                </button>

                <div className="input-group">
                  <label htmlFor="ir-height">Height</label>
                  <input
                    id="ir-height"
                    type="number"
                    min="1"
                    max="10000"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                  />
                  <span className="unit-label">px</span>
                </div>
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={lockAspectRatio}
                  onChange={(e) => setLockAspectRatio(e.target.checked)}
                />
                <span>Lock Aspect Ratio ({originalWidth} : {originalHeight})</span>
              </label>
            </div>

            {/* Quick Presets */}
            <div className="ir-panel-section">
              <h3>Quick Size Presets</h3>
              <div className="presets-list">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="preset-btn"
                    onClick={() => applyPreset(p)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Format & Quality */}
            <div className="ir-panel-section">
              <h3>Output Format & Compression</h3>
              <div className="format-selection-row">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="format"
                    value="image/jpeg"
                    checked={format === 'image/jpeg'}
                    onChange={(e) => setFormat(e.target.value)}
                  />
                  <span>JPG</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="format"
                    value="image/png"
                    checked={format === 'image/png'}
                    onChange={(e) => setFormat(e.target.value)}
                  />
                  <span>PNG</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="format"
                    value="image/webp"
                    checked={format === 'image/webp'}
                    onChange={(e) => setFormat(e.target.value)}
                  />
                  <span>WEBP</span>
                </label>
              </div>

              {format !== 'image/png' && (
                <div className="quality-slider-group">
                  <div className="quality-header">
                    <span>Quality:</span>
                    <strong>{quality}%</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="ir-actions-row">
              <button
                type="button"
                className="btn btn-primary btn-download"
                onClick={handleDownload}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : '💾 Download Resized Image'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
              >
                🔄 Upload New
              </button>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="ir-preview-panel">
            <div className="preview-meta-bar">
              <div className="meta-col">
                <span className="meta-label">Original:</span>
                <strong>{originalWidth} × {originalHeight} px</strong>
                <span className="meta-sub">({formatFileSize(originalSize)})</span>
              </div>
              <div className="meta-arrow">➔</div>
              <div className="meta-col">
                <span className="meta-label">Resized:</span>
                <strong>{width} × {height} px</strong>
                <span className="meta-sub">({formatFileSize(resizedSize)})</span>
              </div>
              {compressionPercent > 0 && (
                <span className="compression-badge">
                  {compressionPercent}% smaller
                </span>
              )}
            </div>

            <div className="preview-canvas-wrapper">
              {resizedUrl ? (
                <img
                  ref={imgElementRef}
                  src={resizedUrl}
                  alt="Resized output preview"
                  className="preview-image"
                />
              ) : (
                <span className="preview-loading">Rendering preview...</span>
              )}
            </div>
          </div>
        </div>
      )}

      <AdBanner slot="image-resizer-mid" format="horizontal" />

      <section className="tool-seo-content">
        <h2>About Our Free Online Image Resizer</h2>
        <p>
          The DevToolBox <strong>Online Image Resizer</strong> is a high-speed, browser-native utility created for web designers, 
          social media marketers, and developers. Easily resize any image to exact pixel dimensions, apply instant presets 
          for YouTube, Instagram, X (Twitter), and LinkedIn, or compress file sizes for faster website load times.
        </p>

        <h3>Why Resize Images with DevToolBox?</h3>
        <ul>
          <li><strong>Zero Upload Latency:</strong> All image processing executes via HTML5 Canvas in your local browser sandbox.</li>
          <li><strong>Social Media Ready:</strong> Built-in templates for Instagram reels, YouTube thumbnails, X cards, and banners.</li>
          <li><strong>Aspect Ratio Lock:</strong> Keep original photo proportions without distortion or warping.</li>
          <li><strong>Multiple Formats:</strong> Convert and export to modern high-efficiency WEBP, crisp PNG, or lightweight JPG.</li>
          <li><strong>100% Private & Confidential:</strong> Sensitive photos and personal graphic assets never travel across internet servers.</li>
        </ul>

        <p>
          Looking for other developer tools? Draft documentation with our <Link to="/tools/notepad">Online Notepad</Link>, 
          audit social media caption length with our <Link to="/tools/word-counter">Word Counter</Link>, or format structured payloads with our <Link to="/tools/json-formatter">JSON Formatter</Link>.
        </p>

        <h3>Frequently Asked Questions</h3>
        <div className="ir-faqs-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {imageResizerFaqs.map((faq, i) => (
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

export default ImageResizer;
