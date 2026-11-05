import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEOHead from '../components/SEOHead/SEOHead';
import AdBanner from '../components/AdBanner/AdBanner';
import blogPosts from '../data/blogPosts';
import './Blog.css';

const BlogList = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...new Set(blogPosts.map(p => p.category))];
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(p => p.category === selectedCategory);

  const structuredData = [
    {
      "@type": "Blog",
      "name": "DevToolBox Developer & SEO Blog",
      "description": "Developer tips, SEO optimization guides, and productivity tutorials. Learn how to use free online tools effectively.",
      "url": "https://tools.trendbit.lol/blog"
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
          "name": "Blog",
          "item": "https://tools.trendbit.lol/blog"
        }
      ]
    }
  ];

  return (
    <div className="blog-page">
      <SEOHead
        title="Developer & SEO Blog - Free Online Guides"
        description="Read expert developer tips, SEO guides, and productivity tutorials on the DevToolBox blog. Learn how to use free online tools effectively."
        keywords="developer blog, SEO tips, content optimization, online tools guide, programming tips, writing productivity, developer productivity"
        canonicalUrl="/blog"
        ogType="blog"
        structuredData={structuredData}
      />
      
      <header className="blog-index-header">
        <h1>DevToolBox Developer & SEO Blog</h1>
        <p className="blog-subtitle">
          Expert guides, best practices, and actionable tutorials on web development, SEO content optimization, and workflow efficiency. 
          Put our strategies to work using our <Link to="/tools">free online developer tools</Link>.
        </p>
      </header>

      <div className="blog-categories" role="tablist" aria-label="Filter posts by category">
        {categories.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={selectedCategory === cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <AdBanner slot="blog-index-top" format="horizontal" />

      <div className="blog-grid">
        {filteredPosts.map((post, index) => (
          <article key={post.id} className="blog-card">
            <div className="blog-card-meta">
              <span className="blog-category-tag">{post.category}</span>
              <span className="blog-date">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h2>
              <Link to={`/blog/${post.id}`}>{post.title}</Link>
            </h2>
            <p className="blog-excerpt">{post.excerpt}</p>
            <div className="blog-card-footer">
              <span className="blog-read-time">⏱️ {post.readTime}</span>
              <Link to={`/blog/${post.id}`} className="blog-read-more" aria-label={`Read article: ${post.title}`}>
                Read Full Guide →
              </Link>
            </div>
            {index === 1 && (
              <div className="blog-card-ad-wrapper">
                <AdBanner slot="blog-inline-feed" format="rectangle" />
              </div>
            )}
          </article>
        ))}
      </div>

      <AdBanner slot="blog-index-bottom" format="horizontal" />

      <section className="blog-seo-footer">
        <h2>Power Your Workflow with Our Free Developer Tools</h2>
        <p>
          Apply the knowledge from our articles directly with our browser-based utility suite. No signups, no data logging, completely free:
        </p>
        <ul className="blog-tools-recommendations">
          <li>
            <strong><Link to="/tools/notepad">Free Online Notepad</Link></strong>: Zero-distraction scratchpad with local auto-save, export options, and dark mode.
          </li>
          <li>
            <strong><Link to="/tools/word-counter">SEO Word Counter Tool</Link></strong>: Real-time word, character, sentence, reading time, and keyword density diagnostics.
          </li>
          <li>
            <strong><Link to="/tools/json-formatter">Online JSON Formatter & Validator</Link></strong>: Pretty-print, validate, minify, and inspect complex JSON payloads client-side.
          </li>
        </ul>
      </section>
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.id === slug);

  if (!post) {
    return (
      <div className="blog-page">
        <SEOHead 
          title="Article Not Found - DevToolBox" 
          description="The requested blog post could not be found. Browse our available articles." 
        />
        <div className="not-found-box">
          <h1>Article Not Found</h1>
          <p>The post you are looking for has been moved or does not exist.</p>
          <Link to="/blog" className="btn btn-primary">Return to All Articles</Link>
        </div>
      </div>
    );
  }

  const structuredData = [
    {
      "@type": "Article",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "dateModified": post.lastModified || post.date,
      "author": { 
        "@type": "Organization", 
        "name": post.author,
        "url": "https://tools.trendbit.lol/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "DevToolBox",
        "url": "https://tools.trendbit.lol"
      },
      "keywords": post.keywords
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
          "name": "Blog",
          "item": "https://tools.trendbit.lol/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.title,
          "item": `https://tools.trendbit.lol/blog/${post.id}`
        }
      ]
    }
  ];

  // Markdown-like parser for clean rendering
  const renderContent = (content) => {
    const lines = content.trim().split('\n');
    const elements = [];
    let i = 0;
    let inCodeBlock = false;
    let codeContent = '';
    let inTable = false;
    let tableRows = [];
    let inList = false;
    let listItems = [];
    let listType = 'ul';

    const parseInline = (text) => {
      const parts = [];
      let remaining = text;
      let key = 0;

      while (remaining.length > 0) {
        const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
        const codeMatch = remaining.match(/`([^`]+)`/);
        const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

        let firstMatch = null;
        let firstIndex = remaining.length;

        if (linkMatch && linkMatch.index < firstIndex) { firstMatch = 'link'; firstIndex = linkMatch.index; }
        if (codeMatch && codeMatch.index < firstIndex) { firstMatch = 'code'; firstIndex = codeMatch.index; }
        if (boldMatch && boldMatch.index < firstIndex) { firstMatch = 'bold'; firstIndex = boldMatch.index; }

        if (!firstMatch) {
          parts.push(remaining);
          break;
        }

        if (firstIndex > 0) {
          parts.push(remaining.substring(0, firstIndex));
        }

        if (firstMatch === 'link') {
          const isExternal = linkMatch[2].startsWith('http');
          if (isExternal) {
            parts.push(<a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer">{linkMatch[1]}</a>);
          } else {
            parts.push(<Link key={key++} to={linkMatch[2]}>{linkMatch[1]}</Link>);
          }
          remaining = remaining.substring(firstIndex + linkMatch[0].length);
        } else if (firstMatch === 'code') {
          parts.push(<code key={key++}>{codeMatch[1]}</code>);
          remaining = remaining.substring(firstIndex + codeMatch[0].length);
        } else if (firstMatch === 'bold') {
          parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
          remaining = remaining.substring(firstIndex + boldMatch[0].length);
        }
      }

      return parts;
    };

    const flushList = () => {
      if (inList && listItems.length > 0) {
        const Tag = listType;
        elements.push(<Tag key={`list-${elements.length}`}>{listItems.map((item, j) => <li key={j}>{parseInline(item)}</li>)}</Tag>);
        listItems = [];
        inList = false;
      }
    };

    const flushTable = () => {
      if (inTable && tableRows.length > 0) {
        const headerCells = tableRows[0];
        const bodyRows = tableRows.slice(2);
        elements.push(
          <div key={`table-${elements.length}`} className="blog-table-wrapper">
            <table>
              <thead>
                <tr>{headerCells.map((cell, j) => <th key={j}>{parseInline(cell.trim())}</th>)}</tr>
              </thead>
              <tbody>
                {bodyRows.map((row, j) => (
                  <tr key={j}>{row.map((cell, k) => <td key={k}>{parseInline(cell.trim())}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    while (i < lines.length) {
      const line = lines[i];

      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(<pre key={`code-${elements.length}`} className="blog-code"><code>{codeContent.trim()}</code></pre>);
          inCodeBlock = false;
          codeContent = '';
          i++;
          continue;
        } else {
          flushList();
          flushTable();
          inCodeBlock = true;
          i++;
          continue;
        }
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        i++;
        continue;
      }

      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        flushList();
        if (!inTable) inTable = true;
        const cells = line.trim().split('|').filter(c => c.trim() !== '');
        tableRows.push(cells);
        i++;
        continue;
      } else if (inTable) {
        flushTable();
      }

      if (line.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={`h3-${i}`}>{parseInline(line.substring(4))}</h3>);
        i++;
        continue;
      }
      if (line.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={`h2-${i}`}>{parseInline(line.substring(3))}</h2>);
        i++;
        continue;
      }

      if (line.match(/^(\d+)\. /)) {
        if (!inList || listType !== 'ol') { flushList(); inList = true; listType = 'ol'; }
        listItems.push(line.replace(/^\d+\. /, ''));
        i++;
        continue;
      }
      if (line.startsWith('- ')) {
        if (!inList || listType !== 'ul') { flushList(); inList = true; listType = 'ul'; }
        listItems.push(line.substring(2));
        i++;
        continue;
      }

      flushList();

      if (line.trim() === '') {
        i++;
        continue;
      }

      elements.push(<p key={`p-${i}`}>{parseInline(line)}</p>);
      i++;
    }

    flushList();
    flushTable();
    return elements;
  };

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="blog-page">
      <SEOHead
        title={post.title}
        description={post.excerpt}
        keywords={post.keywords}
        canonicalUrl={`/blog/${post.id}`}
        ogType="article"
        structuredData={structuredData}
      />

      <article className="blog-article">
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link> &gt; <Link to="/blog">Blog</Link> &gt; <span>{post.title}</span>
        </nav>

        <header className="blog-article-header">
          <span className="blog-category-tag">{post.category}</span>
          <h1 className="blog-article-title">{post.title}</h1>
          <div className="blog-article-meta">
            <span>By {post.author}</span>
            <span>•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <AdBanner slot="blog-article-top" format="horizontal" />

        <div className="blog-article-content">
          {renderContent(post.content)}
        </div>

        <div className="blog-article-tags">
          <span className="tags-label">Related Topics:</span>
          {post.tags.map((tag, i) => (
            <span key={i} className="blog-tag">{tag}</span>
          ))}
        </div>
      </article>

      <AdBanner slot="blog-article-mid" format="rectangle" />

      <section className="related-posts">
        <h2>Related Educational Guides</h2>
        <div className="related-grid">
          {relatedPosts.map(rp => (
            <Link to={`/blog/${rp.id}`} key={rp.id} className="related-card">
              <span className="related-category">{rp.category}</span>
              <h3>{rp.title}</h3>
              <span className="related-meta">{rp.readTime}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="blog-cta-tools">
        <h2>Launch Relevant Developer Tools</h2>
        <div className="tools-cta-grid">
          <Link to="/tools/notepad" className="tool-cta-card">
            <span className="cta-icon">📝</span>
            <span className="cta-title">Online Notepad</span>
            <span className="cta-desc">Distraction-free auto-saving editor</span>
          </Link>
          <Link to="/tools/word-counter" className="tool-cta-card">
            <span className="cta-icon">🔢</span>
            <span className="cta-title">Word Counter</span>
            <span className="cta-desc">Live word count & keyword density</span>
          </Link>
          <Link to="/tools/json-formatter" className="tool-cta-card">
            <span className="cta-icon">{'{}'}</span>
            <span className="cta-title">JSON Formatter</span>
            <span className="cta-desc">Validate & beautify payloads</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

const Blog = () => {
  const { slug } = useParams();
  return slug ? <BlogPost /> : <BlogList />;
};

export default Blog;
