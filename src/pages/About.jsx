import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead/SEOHead';
import './About.css';

const About = () => {
  const structuredData = [
    {
      "@type": "Organization",
      "name": "DevToolBox",
      "url": "https://tools.trendbit.lol",
      "description": "Free online browser-based developer tools suite including stopwatch, notepad, word counter, JSON formatter, image resizer, and cryptographic utilities.",
      "foundingDate": "2024"
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
          "name": "About",
          "item": "https://tools.trendbit.lol/about"
        }
      ]
    }
  ];

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
            <h3>⏱️ <Link to="/tools/stopwatch">Online Stopwatch & Timer</Link></h3>
            <p>Millisecond-precision stopwatch with split lap tracking, countdown timer presets, and fullscreen display.</p>
          </div>
          <div className="offering">
            <h3>📝 <Link to="/tools/notepad">Online Notepad</Link></h3>
            <p>A distraction-free text editor with default dark mode, auto-save, and full-page expansion.</p>
          </div>
          <div className="offering">
            <h3>🔢 <Link to="/tools/word-counter">Word Counter</Link></h3>
            <p>Real-time word, character, and sentence analytics with social media character limit validation.</p>
          </div>
          <div className="offering">
            <h3>{'{ } '}<Link to="/tools/json-formatter">JSON Formatter</Link></h3>
            <p>Format, validate, beautify, and minify JSON data with instant syntax error detection.</p>
          </div>
          <div className="offering">
            <h3>🖼️ <Link to="/tools/image-resizer">Image Resizer</Link></h3>
            <p>Resize JPG, PNG, and WEBP images locally using HTML5 Canvas with custom dimensions and social presets.</p>
          </div>
          <div className="offering">
            <h3>🔑 <Link to="/tools/password-generator">Password Generator</Link></h3>
            <p>Cryptographically secure password and passphrase generator with entropy score and crack-time metrics.</p>
          </div>
          <div className="offering">
            <h3>📦 <Link to="/tools/base64-encoder">Base64 & URL Encoder</Link></h3>
            <p>Encode and decode UTF-8 text, URL query strings, and convert image and document files into Data URIs.</p>
          </div>
          <div className="offering">
            <h3>📝 <Link to="/tools/markdown-previewer">Markdown Previewer</Link></h3>
            <p>Live side-by-side Markdown to HTML editor and previewer with formatting toolbar and instant export.</p>
          </div>
          <div className="offering">
            <h3>🆔 <Link to="/tools/uuid-generator">UUID / GUID Generator</Link></h3>
            <p>Generate RFC 4122 v4 UUID identifiers in bulk with custom casing, and convert Unix epoch timestamps.</p>
          </div>
          <div className="offering">
            <h3>🎨 <Link to="/tools/color-converter">Color Converter & Contrast</Link></h3>
            <p>Convert HEX, RGB, and HSL colors, inspect tints and shades, and audit WCAG 2.1 AA/AAA contrast ratios.</p>
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
