import { useRouter } from 'next/router';
import Head from 'next/head';
import MarkdownDocs from '../../components/docs/MarkdownDocs';
import React, { useEffect, useState } from 'react';

const DocsPage = () => {
  const router = useRouter();
  const { filename } = router.query;
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    // Fetch the metadata here and set it
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`https://open.datactivist.coop/api/metadoc?filename=${filename}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMetadata(data.metadata);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    if (filename) {
      fetchMetadata();
    }
  }, [filename]);

  const absoluteUrl = (path = '') => {
    return `${window.location.origin}${path}`;
  };

  return (
    <div>
      <Head>
        <title>{metadata?.title || 'Default Title'}</title>
        <meta name="description" content={metadata?.description || 'Default Description'} />
        {/* Open Graph / Facebook / LinkedIn */}
        {metadata?.image && (
          <>
            <meta property="og:image" content={absoluteUrl(metadata.image)} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:title" content={metadata?.title || 'Default Title'} />
            <meta property="og:description" content={metadata?.description || 'Default Description'} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={absoluteUrl(router.asPath)} />
          </>
        )}
        {/* Twitter */}
        {metadata?.image && (
          <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={absoluteUrl(metadata.image)} />
            <meta name="twitter:title" content={metadata?.title || 'Default Title'} />
            <meta name="twitter:description" content={metadata?.description || 'Default Description'} />
          </>
        )}
      </Head>
      <br></br>
      {filename && <MarkdownDocs filename={filename} metadata={metadata} />}
    </div>
  );
};

export default DocsPage;
