import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead/SEOHead';
import './Privacy.css';

const Privacy = () => {
  return (
    <div className="legal-page">
      <SEOHead
        title="Privacy Policy"
        description="Read DevToolBox's privacy policy. Learn how we protect your data and respect your privacy when using our free online developer tools."
        keywords="privacy policy, data protection, DevToolBox privacy, online tools privacy"
        canonicalUrl="/privacy"
      />
      
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last Updated: November 2024</p>

      <section>
        <h2>Introduction</h2>
        <p>
          At DevToolBox ("we," "our," or "us"), your privacy is our top priority. This Privacy Policy explains how we 
          collect, use, and protect information when you visit our website and use our <Link to="/tools">free online tools</Link>.
        </p>
      </section>

      <section>
        <h2>Information We Collect</h2>
        <h3>Data You Provide to Our Tools</h3>
        <p>
          All text and data you enter into our tools (including the <Link to="/tools/notepad">Online Notepad</Link>, 
          <Link to="/tools/word-counter"> Word Counter</Link>, and <Link to="/tools/json-formatter"> JSON Formatter</Link>) 
          is processed entirely within your web browser. <strong>We do not collect, transmit, or store any of the content 
          you enter into our tools.</strong>
        </p>

        <h3>Automatically Collected Information</h3>
        <p>When you visit our website, we may automatically collect certain information, including:</p>
        <ul>
          <li>Browser type and version</li>
          <li>Device type (desktop, mobile, tablet)</li>
          <li>Pages visited and time spent</li>
          <li>Referring URL</li>
          <li>IP address (anonymized)</li>
        </ul>
        <p>This information is collected through standard web analytics to help us improve our services.</p>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <p>We use the automatically collected information to:</p>
        <ul>
          <li>Improve our website and tools</li>
          <li>Understand how users interact with our services</li>
          <li>Diagnose technical issues</li>
          <li>Analyze usage trends</li>
        </ul>
      </section>

      <section>
        <h2>Third-Party Advertising</h2>
        <p>
          We use third-party advertising services (such as Google AdSense/AdMob) to display advertisements on our website. 
          These services may use cookies and similar technologies to serve ads based on your prior visits to our website 
          or other websites. You can opt out of personalized advertising by visiting 
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"> Google's Ads Settings</a>.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Our website may use cookies for essential functionality and analytics. Third-party ad services may also set 
          cookies. You can control cookie preferences through your browser settings.
        </p>
      </section>

      <section>
        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect the limited information we collect. Since our tools 
          process data locally in your browser, your content data is inherently secure and private.
        </p>
      </section>

      <section>
        <h2>Children's Privacy</h2>
        <p>
          Our services are not directed to children under 13. We do not knowingly collect personal information from 
          children under 13.
        </p>
      </section>

      <section>
        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify users of any material changes by 
          updating the "Last Updated" date at the top of this page.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us through our <Link to="/about">About page</Link>.
        </p>
      </section>
    </div>
  );
};

export default Privacy;
