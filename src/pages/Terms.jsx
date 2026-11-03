import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead/SEOHead';
import './Privacy.css';

const Terms = () => {
  return (
    <div className="legal-page">
      <SEOHead
        title="Terms of Service"
        description="Read DevToolBox's terms of service. Understand the rules and guidelines for using our free online developer tools."
        keywords="terms of service, terms and conditions, DevToolBox terms, usage policy"
        canonicalUrl="/terms"
      />
      
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last Updated: November 2024</p>

      <section>
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using DevToolBox (<Link to="/">tools.trendbit.lol</Link>), you accept and agree to be bound by 
          these Terms of Service. If you do not agree to these terms, please do not use our services.
        </p>
      </section>

      <section>
        <h2>Description of Service</h2>
        <p>
          DevToolBox provides free, browser-based developer tools including but not limited to an 
          <Link to="/tools/notepad"> Online Notepad</Link>, <Link to="/tools/word-counter"> Word Counter</Link>, and 
          <Link to="/tools/json-formatter"> JSON Formatter</Link>. All tools are provided "as is" without warranties of any kind.
        </p>
      </section>

      <section>
        <h2>Use of Services</h2>
        <p>You agree to use our services only for lawful purposes. You must not:</p>
        <ul>
          <li>Use our services for any illegal or unauthorized purpose</li>
          <li>Attempt to interfere with the proper functioning of our website</li>
          <li>Use automated systems to access our services in a manner that exceeds reasonable use</li>
          <li>Copy, modify, or distribute our website content without permission</li>
        </ul>
      </section>

      <section>
        <h2>Intellectual Property</h2>
        <p>
          The content, design, and code of DevToolBox are protected by intellectual property laws. You may not 
          reproduce, distribute, or create derivative works without our written permission.
        </p>
      </section>

      <section>
        <h2>User Content</h2>
        <p>
          Any data you input into our tools remains your property. Since all processing occurs locally in your 
          browser, we do not access, store, or claim any rights to your content.
        </p>
      </section>

      <section>
        <h2>Advertisements</h2>
        <p>
          Our website displays advertisements through third-party ad networks. By using our services, you acknowledge 
          that advertisements are part of the user experience and help us keep our tools free.
        </p>
      </section>

      <section>
        <h2>Disclaimer of Warranties</h2>
        <p>
          Our services are provided "as is" and "as available" without any warranties, express or implied. We do not 
          guarantee that our tools will be uninterrupted, error-free, or free of harmful components.
        </p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          In no event shall DevToolBox be liable for any indirect, incidental, special, consequential, or punitive 
          damages arising out of or related to your use of our services.
        </p>
      </section>

      <section>
        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of our services after changes 
          constitutes acceptance of the modified terms.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          For questions about these Terms of Service, please visit our <Link to="/about">About page</Link>.
        </p>
      </section>
    </div>
  );
};

export default Terms;
