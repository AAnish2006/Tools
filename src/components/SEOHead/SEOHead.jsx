import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  ogType = 'website',
  ogImage = '/favicon.svg',
  structuredData,
  faqData
}) => {
  const siteTitle = 'DevToolBox';
  const fullTitle = !title
    ? `${siteTitle} — Online Notepad, Word Counter, JSON Formatter & Image Resizer`
    : title.includes(siteTitle)
      ? title
      : `${title} | ${siteTitle}`;

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://tools.trendbit.lol';
  const canonicalFull = canonicalUrl ? `${siteUrl}${canonicalUrl}` : `${siteUrl}/`;

  // Build JSON-LD structured data graph with official Google Site Name schema
  const jsonLdGraph = [
    {
      "@type": "WebSite",
      "name": "DevToolBox",
      "alternateName": ["DevToolBox Tools", "DevToolBox Online", "DevToolBox Suite"],
      "url": "https://tools.trendbit.lol/"
    }
  ];

  if (structuredData) {
    if (Array.isArray(structuredData)) {
      jsonLdGraph.push(...structuredData);
    } else {
      jsonLdGraph.push(structuredData);
    }
  }

  if (faqData && Array.isArray(faqData) && faqData.length > 0) {
    jsonLdGraph.push({
      "@type": "FAQPage",
      "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    });
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Official Google Search Site Name Directives */}
      <meta name="application-name" content="DevToolBox" />
      <meta name="apple-mobile-web-app-title" content="DevToolBox" />

      {/* Canonical */}
      <link rel="canonical" href={canonicalFull} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:url" content={canonicalFull} />
      <meta property="og:site_name" content="DevToolBox" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Structured Data (Schema.org) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": jsonLdGraph
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
