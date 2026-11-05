import { Link, Outlet, useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead/SEOHead';
import AdBanner from '../components/AdBanner/AdBanner';
import './Tools.css';

const ToolsIndex = () => {
  const tools = [
    {
      title: 'Online Stopwatch & Timer',
      desc: 'High-precision millisecond stopwatch with split lap tracking, countdown timer presets, audio alerts, and fullscreen mode.',
      icon: '⏱️',
      link: '/tools/stopwatch',
      tags: ['Timer', 'Stopwatch', 'Productivity']
    },
    {
      title: 'Online Notepad',
      desc: 'Write and edit text instantly in your browser. Features auto-save, distraction-free mode, and easy copy-paste functionality.',
      icon: '📝',
      link: '/tools/notepad',
      tags: ['Text Editor', 'Notes', 'Writing']
    },
    {
      title: 'Word Counter',
      desc: 'Count words, characters, sentences, and paragraphs. Get reading time estimates and keyword density analysis for SEO.',
      icon: '🔢',
      link: '/tools/word-counter',
      tags: ['SEO', 'Writing', 'Analytics']
    },
    {
      title: 'JSON Formatter',
      desc: 'Format, validate, minify, and beautify JSON data. Syntax highlighting and error detection for API debugging.',
      icon: '{ }',
      link: '/tools/json-formatter',
      tags: ['Developer', 'API', 'Debug']
    },
    {
      title: 'Image Resizer',
      desc: 'Resize JPG, PNG, and WEBP images in your browser. Custom pixel dimensions, social media presets, and aspect ratio locking.',
      icon: '🖼️',
      link: '/tools/image-resizer',
      tags: ['Image', 'Design', 'Social Media']
    },
    {
      title: 'Password Generator',
      desc: 'Generate cryptographically strong passwords and memorable passphrases with instant entropy analysis and length customization.',
      icon: '🔑',
      link: '/tools/password-generator',
      tags: ['Security', 'Privacy', 'Crypto']
    },
    {
      title: 'Base64 & URL Encoder',
      desc: 'Encode and decode Base64 strings, URL query parameters, and convert files to Base64 data URIs with full UTF-8 & emoji support.',
      icon: '📦',
      link: '/tools/base64-encoder',
      tags: ['Developer', 'Web', 'Encoding']
    },
    {
      title: 'Markdown Previewer',
      desc: 'Live side-by-side Markdown to HTML editor and previewer with formatting toolbar, table support, and instant .md/.html export.',
      icon: '📝',
      link: '/tools/markdown-previewer',
      tags: ['Markdown', 'Writing', 'Docs']
    },
    {
      title: 'UUID / GUID Generator',
      desc: 'Generate RFC 4122 compliant UUID v4 identifiers in bulk, customizable hyphens/uppercase, and live Unix epoch timestamp converter.',
      icon: '🆔',
      link: '/tools/uuid-generator',
      tags: ['Developer', 'UUID', 'Database']
    },
    {
      title: 'Color Converter & Contrast',
      desc: 'Convert HEX, RGB, and HSL colors, generate shades & tints, and audit WCAG 2.1 AA/AAA accessibility contrast compliance.',
      icon: '🎨',
      link: '/tools/color-converter',
      tags: ['Design', 'CSS', 'Accessibility']
    }
  ];

  const structuredData = [
    {
      "@type": "CollectionPage",
      "name": "Free Online Developer Tools Suite - DevToolBox",
      "url": "https://tools.trendbit.lol/tools",
      "description": "Collection of free, client-side developer utilities including stopwatch, notepad, word counter, json formatter, and image resizer."
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
        }
      ]
    }
  ];

  return (
    <div className="tools-page">
      <SEOHead
        title="All Free Developer Tools — Stopwatch, Notepad, Word Counter, JSON, Passwords & Color"
        description="Access free browser-based developer utilities: Online Stopwatch & Timer, Online Notepad, Word Counter, JSON Formatter, Image Resizer, Password Generator, Base64 Encoder, Markdown Previewer, UUID Generator, and Color Contrast Checker."
        keywords="free online tools, online stopwatch, countdown timer, developer tools, text editor, word counter, JSON formatter, image resizer, password generator, base64 encoder, markdown previewer, uuid generator, color converter"
        canonicalUrl="/tools"
        structuredData={structuredData}
      />
      <h1 className="tools-page-title">Free Online Developer Tools</h1>
      <p className="tools-page-subtitle">
        Choose from our collection of free, browser-based tools. No installation, no signup — just click and use.
      </p>

      <div className="tools-list">
        {tools.map((tool, index) => (
          <Link to={tool.link} key={index} className="tools-list-card">
            <div className="tools-list-icon">{tool.icon}</div>
            <div className="tools-list-info">
              <h2>{tool.title}</h2>
              <p>{tool.desc}</p>
              <div className="tools-tags">
                {tool.tags.map((tag, i) => (
                  <span key={i} className="tool-tag">{tag}</span>
                ))}
              </div>
            </div>
            <span className="tools-list-arrow">→</span>
          </Link>
        ))}
      </div>

      <AdBanner slot="tools-page-bottom" format="rectangle" />

      <section className="tools-info">
        <h2>Why Use Our Free Online Tools?</h2>
        <p>
          DevToolBox provides a curated suite of <strong>free online developer tools</strong> that run entirely in your browser. 
          Whether you need a quick <Link to="/tools/notepad">online notepad</Link> to jot down notes, a 
          <Link to="/tools/word-counter"> word counter</Link> for content optimization, or a 
          <Link to="/tools/json-formatter"> JSON formatter</Link> for debugging API responses — we've got you covered.
        </p>
        <p>
          All tools are designed with privacy in mind. Your data is processed locally and never sent to any server. 
          Read more about our commitment to user privacy on our <Link to="/blog">blog</Link>.
        </p>
      </section>
    </div>
  );
};

const Tools = () => {
  const location = useLocation();
  const isIndex = location.pathname === '/tools';

  return isIndex ? <ToolsIndex /> : <Outlet />;
};

export default Tools;
