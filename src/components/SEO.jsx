import React from 'react';
import { Helmet } from 'react-helmet-async';

import PropTypes from 'prop-types';

const SEO = ({ title, description, keywords, image, url, type = 'website' }) => {
  const siteTitle = 'TravelGuide';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'Discover the world with TravelGuide. Your ultimate source for travel inspiration, city guides, and hidden gems.';
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || 'travel, guide, destination, holiday, vacation, explore, tourism';
  const metaImage = image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'; // Default hero image
  const metaUrl = url || window.location.href;

  console.log('SEO Rendering (Native):', { fullTitle, metaDescription, metaKeywords });

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
};

export default SEO;
