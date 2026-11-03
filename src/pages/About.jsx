import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead/SEOHead';
import './About.css';

const About = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DevToolBox",
    "url": "https://tools.trendbit.lol",
    "description": "Free online developer tools platform providing notepad, word counter, and JSON formatter.",
    "foundingDate": "2024"
  };

  return (
    <div className="about-page">
      <SEOHead
        title="About DevToolBox"
        description="Learn about DevToolBox — a free platform offering online developer tools. Our mission is to make development faster and more accessible."
        keywords="about DevToolBox, free developer tools, online tools platform, about us"
        canonicalUrl="/about"
        structuredData={structuredData}
      />
      
      <h1>About DevToolBox</h1>
      
      <section className="about-hero">
        <p className="about-lead">
          DevToolBox is a free, open platform that provides essential developer tools right in your browser. 
          Our mission is to make everyday development tasks faster, simpler, and more accessible.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          We believe that essential developer tools should be free, fast, and private. Too many online tools are bloated 
          with ads, require signups, or send your data to remote servers. DevToolBox is different — every tool runs 
          entirely in your browser, ensuring your data stays on your device.
        </p>
      </section>

      <section className="about-section">
        <h2>What We Offer</h2>
        <div className="about-offerings">
          <div className="offering">
            <h3>📝 <Link to="/tools/notepad">Online Notepad</Link></h3>
            <p>A distraction-free text editor with auto-save, perfect for quick notes and code snippets.</p>
          </div>
          <div className="offering">
            <h3>🔢 <Link to="/tools/word-counter">Word Counter</Link></h3>
            <p>Comprehensive text analysis with word count, character count, reading time, and keyword density.</p>
          </div>
          <div className="offering">
            <h3>{'{ } '}<Link to="/tools/json-formatter">JSON Formatter</Link></h3>
            <p>Format, validate, and beautify JSON data with syntax highlighting and error detection.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Values</h2>
        <ul className="values-list">
          <li><strong>Privacy First:</strong> All processing happens locally in your browser. We never collect or store your data.</li>
          <li><strong>Always Free:</strong> Our core tools will always be free to use with no signup required.</li>
          <li><strong>Quality Over Quantity:</strong> We focus on building fewer, better tools rather than a hundred mediocre ones.</li>
          <li><strong>Accessibility:</strong> Our tools are designed to work on any device, any browser, for everyone.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Built for Developers, by Developers</h2>
        <p>
          DevToolBox is built by a team of experienced developers who understand the daily frustrations of searching 
          for reliable online tools. We use these tools ourselves every day, and we're committed to keeping them 
          fast, reliable, and free.
        </p>
        <p>
          Have feedback or suggestions? We'd love to hear from you. Check out our <Link to="/blog">blog</Link> for 
          the latest updates, tips, and tutorials.
        </p>
      </section>
    </div>
  );
};

export default About;
