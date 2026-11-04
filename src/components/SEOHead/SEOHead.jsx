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
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - Free Online Developer Tools`;
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://tools.trendbit.lol';
  const canonicalFull = canonicalUrl ? `${siteUrl}${canonicalUrl}` : `${siteUrl}/`;

  // Build JSON-LD structured data graph
  const jsonLdGraph = [];

  if (structuredData) {
    if (Array.isArray(structuredData)) {
      jsonLdGraph.push(...structuredData);
    } else {
      jsonLdGraph.push(structuredData);
    }
  }

  if (faqData && Array.isArray(faqData) && faqData.length > 0) {
    jsonLdGraph.push({
      "@context": "https://schema.org",
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
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalFull} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:url" content={canonicalFull} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Structured Data (Schema.org) */}
      {jsonLdGraph.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": jsonLdGraph
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
