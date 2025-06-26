import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const SWAGGER_URL = '/api/swagger.yaml'; // updated to new API route

export default function ApiDocsPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    // Import CSS only on client
    import('swagger-ui-react/swagger-ui.css');
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div style={{ height: '100vh' }}>
      <SwaggerUI url={SWAGGER_URL} />
    </div>
  );
}
