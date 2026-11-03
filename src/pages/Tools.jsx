import { Link, Outlet, useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead/SEOHead';
import AdBanner from '../components/AdBanner/AdBanner';
import './Tools.css';

const ToolsIndex = () => {
  const tools = [
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
    }
  ];

  return (
    <div className="tools-page">
      <SEOHead
        title="Free Online Tools"
        description="Access free online developer tools: notepad, word counter, JSON formatter. No installation or signup required. Works in your browser."
        keywords="free online tools, developer tools, text editor, word counter, JSON formatter, online utilities"
        canonicalUrl="/tools"
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
