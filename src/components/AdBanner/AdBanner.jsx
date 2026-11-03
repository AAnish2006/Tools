import { useEffect, useState } from 'react';
import './AdBanner.css';

/**
 * AdBanner component for Google AdSense / AdMob Web integration.
 * Securely reads publisher credentials (ca-pub-3950161950238885).
 * - On production (tools.trendbit.lol): Serves live Google AdSense ads.
 * - On localhost: Renders a compact placement card without the 300px empty ghost space that Google's script generates when ads cannot be served on localhost.
 */
const AdBanner = ({ slot, format = 'auto', className = '' }) => {
  const adClient = import.meta.env.VITE_ADSENSE_CLIENT || import.meta.env.VITE_ADMOB_CLIENT_ID || '';
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    const isLocal = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' || 
       window.location.hostname.startsWith('192.168.') ||
       window.location.hostname.startsWith('10.'));
    
    setIsLocalhost(isLocal);

    if (adClient && !isLocal && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        // Suppress push errors
      }
    }
  }, [adClient, slot]);

  if (!adClient) return null;

  const numericSlot = slot && /^\d+$/.test(String(slot)) ? String(slot) : undefined;

  return (
    <aside className={`ad-banner ad-${format} ${className}`} aria-label="Sponsored Advertisement">
      {isLocalhost ? (
        /* Clean, compact Ad Placement Box on Localhost: Zero ghost space, sits directly under content */
        <div className="ad-preview-box">
          <span className="ad-preview-tag">Google AdSense Ad</span>
          <p className="ad-preview-title">
            Slot: <strong>{slot || 'Responsive Banner'}</strong> ({format})
          </p>
          <span className="ad-preview-info">
            Publisher: <code>{adClient}</code> • Ready for <strong>tools.trendbit.lol</strong>
          </span>
        </div>
      ) : (
        /* Real Google AdSense Tag on Production Domain */
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adClient}
          {...(numericSlot ? { 'data-ad-slot': numericSlot } : {})}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </aside>
  );
};

export default AdBanner;
