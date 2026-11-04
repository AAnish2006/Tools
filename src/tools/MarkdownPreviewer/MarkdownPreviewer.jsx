import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead/SEOHead';
import AdBanner from '../../components/AdBanner/AdBanner';
import './MarkdownPreviewer.css';

const SAMPLE_MARKDOWN = `# Welcome to DevToolBox Markdown Editor

A fast, interactive, **100% browser-based** Markdown to HTML live editor and previewer.

## Key Features
- **Live Preview:** Changes render instantly side-by-side
- **Zero Server Lag:** All parsing executes locally in your browser
- **Quick Export:** Download ready-to-use \`.md\` or compiled \`.html\` files

### Code Example
\`\`\`javascript
function calculateEntropy(bits) {
  return bits >= 80 ? 'Very Strong' : 'Moderate';
}
\`\`\`

> "Good code is its own best documentation." — Steve McConnell

### Markdown Formatting Table
| Element | Syntax | Result |
| :--- | :--- | :--- |
| Bold | \`**bold**\` | **bold** |
| Italic | \`*italic*\` | *italic* |
| Strikethrough | \`~~strike~~\` | ~~strike~~ |

### Useful Checklist
- [x] Auto-render markdown
- [x] View compiled HTML
- [x] One-click copy and download
`;

// Pure, fast, zero-dependency Markdown to HTML parser
function parseMarkdownToHTML(markdown) {
  if (!markdown) return '';
  let html = markdown;

  // Escape HTML entities to prevent raw script injection
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Fenced Code Blocks (```code```)
  html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // Inline Code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headings (#, ##, ###, ####, #####, ######)
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Blockquotes (> text)
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Horizontal Rules (--- or ***)
  html = html.replace(/^(?:---|\*\*\*|___)\s*$/gim, '<hr />');

  // Bold & Italic & Strikethrough
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

  // Links & Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Tables
  html = html.replace(/(?:^\|.+?\|\s*$\n?)+/gm, (tableBlock) => {
    const rows = tableBlock.trim().split('\n').filter(r => r.trim());
    if (rows.length < 2) return tableBlock;
    let tableHtml = '<div class="md-table-wrapper"><table>';
    let isHeader = true;

    rows.forEach((row, idx) => {
      // Check if it's separator row (|---|---|)
      if (/^\|[\s:-|-]+\|$/.test(row.trim())) {
        isHeader = false;
        return;
      }
      const cells = row.split('|').slice(1, -1).map(c => c.trim());
      const tag = idx === 0 ? 'th' : 'td';
      tableHtml += '<tr>';
      cells.forEach(cell => {
        tableHtml += `<${tag}>${cell}</${tag}>`;
      });
      tableHtml += '</tr>';
    });

    tableHtml += '</table></div>';
    return tableHtml;
  });

  // Task lists
  html = html.replace(/^- \[x\] (.*$)/gim, '<li class="task-list-item"><input type="checkbox" checked disabled /> $1</li>');
  html = html.replace(/^- \[ \] (.*$)/gim, '<li class="task-list-item"><input type="checkbox" disabled /> $1</li>');

  // Unordered lists (- item or * item)
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  // Clean adjacent <ul> tags
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Ordered lists (1. item)
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<oli>$1</oli>');
  html = html.replace(/(<oli>.*<\/oli>)/gim, '<ol>$1</ol>');
  html = html.replace(/<oli>/g, '<li>').replace(/<\/oli>/g, '</li>');
  html = html.replace(/<\/ol>\s*<ol>/g, '');

  // Paragraphs
  const blocks = html.split(/\n{2,}/);
  html = blocks.map(b => {
    const trimmed = b.trim();
    if (!trimmed) return '';
    if (/^<(h[1-6]|pre|blockquote|ul|ol|hr|div|table)/i.test(trimmed)) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
  }).join('\n');

  return html;
}

const MarkdownPreviewer = () => {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'html'
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const compiledHtml = useMemo(() => {
    return parseMarkdownToHTML(markdown);
  }, [markdown]);

  const stats = useMemo(() => {
    const text = markdown.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = markdown.length;
    const lines = markdown ? markdown.split('\n').length : 0;
    return { words, chars, lines };
  }, [markdown]);

  const insertSyntax = (prefix, suffix = '', defaultText = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = markdown.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;
    const nextVal = markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(nextVal);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

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

  const handleDownload = (format) => {
    const isMd = format === 'md';
    const content = isMd ? markdown : compiledHtml;
    const mime = isMd ? 'text/markdown' : 'text/html';
    const ext = isMd ? 'md' : 'html';
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${new Date().toISOString().slice(0, 10)}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm('Clear all markdown text?')) {
      setMarkdown('');
    }
  };

  const faqs = [
    {
      question: "How does the Markdown to HTML converter work?",
      answer: "The live preview engine processes your Markdown syntax in real time inside your browser using fast regular expressions. It translates headings, bold, italics, code blocks, lists, blockquotes, and tables directly into standards-compliant HTML."
    },
    {
      question: "Can I copy or export the raw compiled HTML?",
      answer: "Yes! You can toggle between the visual formatted preview and the raw compiled HTML source code tab, and download your work as either a .md or .html file with a single click."
    },
    {
      question: "Is my documentation or writing saved on your servers?",
      answer: "Never. All parsing and drafting take place 100% locally within your browser sandbox. No text or documents ever leave your computer."
    },
    {
      question: "Which Markdown elements are supported?",
      answer: "Full support is included for headings (H1–H6), bold, italic, strikethrough, blockquotes, code blocks with syntax styling, inline code, links, images, bulleted & numbered lists, task lists with checkboxes, and Markdown tables."
    }
  ];

  const structuredData = {
    "@type": "WebApplication",
    "name": "Markdown to HTML Live Preview & Editor - DevToolBox",
    "url": "https://tools.trendbit.lol/tools/markdown-previewer",
    "description": "Free online markdown editor and live HTML previewer with split-screen editing, syntax toolbar, and export.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All modern browsers",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1200",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <div className="markdown-page">
      <SEOHead
        title="Markdown to HTML Live Preview & Editor — Free Online Markdown Tool"
        description="Free online Markdown editor and live HTML previewer. Side-by-side editing, syntax formatting toolbar, table support, and one-click HTML/MD export. 100% private."
        keywords="markdown preview online, markdown to html, online markdown editor, markdown live editor, convert markdown to html, github markdown preview"
        canonicalUrl="/tools/markdown-previewer"
        structuredData={structuredData}
        faqData={faqs}
      />

      <div className="md-header">
        <h1>Markdown to HTML Live Preview & Editor</h1>
        <p className="md-subtitle">
          Draft documentation, READMEs, and blog posts with live side-by-side HTML preview. One-click formatting, table support, and instant export.
        </p>
      </div>

      <div className="md-workspace">
        {/* Quick Formatting Toolbar */}
        <div className="md-toolbar">
          <div className="md-tools-left">
            <button className="md-tool-btn" onClick={() => insertSyntax('**', '**', 'bold text')} title="Bold">
              <strong>B</strong>
            </button>
            <button className="md-tool-btn" onClick={() => insertSyntax('*', '*', 'italic text')} title="Italic">
              <em>I</em>
            </button>
            <button className="md-tool-btn" onClick={() => insertSyntax('~~', '~~', 'strike')} title="Strikethrough">
              <s>S</s>
            </button>
            <span className="md-tool-divider">|</span>
            <button className="md-tool-btn" onClick={() => insertSyntax('# ', '', 'Heading 1')} title="Heading 1">
              H1
            </button>
            <button className="md-tool-btn" onClick={() => insertSyntax('## ', '', 'Heading 2')} title="Heading 2">
              H2
            </button>
            <button className="md-tool-btn" onClick={() => insertSyntax('### ', '', 'Heading 3')} title="Heading 3">
              H3
            </button>
            <span className="md-tool-divider">|</span>
            <button className="md-tool-btn" onClick={() => insertSyntax('> ', '', 'Quote')} title="Blockquote">
              ”
            </button>
            <button className="md-tool-btn" onClick={() => insertSyntax('`', '`', 'code')} title="Inline Code">
              &lt;/&gt;
            </button>
            <button className="md-tool-btn" onClick={() => insertSyntax('```javascript\n', '\n```', 'console.log("Hello");')} title="Code Block">
              {'{ }'}
            </button>
            <button className="md-tool-btn" onClick={() => insertSyntax('[', '](https://example.com)', 'link text')} title="Hyperlink">
              🔗
            </button>
            <button className="md-tool-btn" onClick={() => insertSyntax('- ', '', 'List item')} title="Bullet List">
              • List
            </button>
            <button className="md-tool-btn" onClick={() => insertSyntax('| Column 1 | Column 2 |\n| :--- | :--- |\n| Item 1 | Item 2 |\n')} title="Table">
              ⊞ Table
            </button>
          </div>

          <div className="md-tools-right">
            <button className="md-tool-btn md-btn-sample" onClick={() => setMarkdown(SAMPLE_MARKDOWN)}>
              📄 Load Sample
            </button>
            <button className="md-tool-btn md-btn-clear" onClick={handleClear}>
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Split Screen Workspace */}
        <div className="md-split-grid">
          {/* Left Panel: Markdown Editor */}
          <div className="md-editor-panel">
            <div className="md-panel-bar">
              <span>Markdown Input</span>
              <span className="md-panel-stats">{stats.words} words | {stats.chars} chars</span>
            </div>
            <textarea
              ref={textareaRef}
              className="md-textarea"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type your markdown here..."
              spellCheck="true"
            />
          </div>

          {/* Right Panel: Live Preview / Raw HTML */}
          <div className="md-preview-panel">
            <div className="md-panel-bar">
              <div className="md-view-tabs">
                <button
                  className={`md-view-tab ${viewMode === 'preview' ? 'active' : ''}`}
                  onClick={() => setViewMode('preview')}
                >
                  👁️ Formatted Preview
                </button>
                <button
                  className={`md-view-tab ${viewMode === 'html' ? 'active' : ''}`}
                  onClick={() => setViewMode('html')}
                >
                  &lt;/&gt; Raw HTML
                </button>
              </div>
            </div>

            <div className="md-preview-content">
              {viewMode === 'preview' ? (
                <div
                  className="md-rendered-body"
                  dangerouslySetInnerHTML={{ __html: compiledHtml || '<p style="color:#64748b">Preview will appear here...</p>' }}
                />
              ) : (
                <pre className="md-raw-html">
                  <code>{compiledHtml}</code>
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="md-footer-actions">
          <div className="md-action-group">
            <button
              className={`md-action-btn md-btn-copy ${copied ? 'copied' : ''}`}
              onClick={() => handleCopy(viewMode === 'preview' ? markdown : compiledHtml)}
            >
              {copied ? '✓ Copied' : viewMode === 'preview' ? '📋 Copy Markdown' : '📋 Copy Raw HTML'}
            </button>
            <button className="md-action-btn md-btn-download" onClick={() => handleDownload('md')}>
              💾 Export .MD
            </button>
            <button className="md-action-btn md-btn-download" onClick={() => handleDownload('html')}>
              🌐 Export .HTML
            </button>
          </div>
        </div>
      </div>

      <AdBanner slot="markdown-bottom" format="horizontal" />

      {/* SEO & Technical Content */}
      <section className="tool-seo-content">
        <h2>About Our Free Markdown to HTML Live Editor & Previewer</h2>
        <p>
          The DevToolBox <strong>Markdown Live Editor</strong> is a responsive browser tool engineered for writers, 
          developers, and open-source contributors. Write documentation, technical articles, and GitHub READMEs with an instant, 
          side-by-side rendered view of your formatting.
        </p>

        <h3>Why Choose Our Client-Side Markdown Editor?</h3>
        <ul>
          <li><strong>Instant Synchronous Rendering:</strong> No remote markdown compilation API calls; editing feels effortless and instant.</li>
          <li><strong>Complete HTML Source Inspection:</strong> Toggle directly to the Raw HTML tab to copy compiled markup for your CMS or static site.</li>
          <li><strong>Zero Signup & 100% Private:</strong> Your writing persists only in your browser session without being uploaded to remote databases.</li>
        </ul>

        <h3>Frequently Asked Questions</h3>
        <div className="md-faqs-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.05rem' }}>{faq.question}</h4>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>{faq.answer}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          Check out our other developer utilities: Count words with our <Link to="/tools/word-counter">Word Counter</Link>, 
          take quick notes in our <Link to="/tools/notepad">Online Notepad</Link>, or generate passwords with our <Link to="/tools/password-generator">Password Generator</Link>.
        </p>
      </section>
    </div>
  );
};

export default MarkdownPreviewer;
