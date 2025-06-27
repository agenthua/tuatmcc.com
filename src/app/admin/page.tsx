'use client';

import { useEffect, useRef } from 'react';

export default function AdminPage() {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Check if script is already loaded
    if (scriptRef.current) {
      return;
    }

    // Create and configure the script element
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js';
    script.type = 'module';
    script.async = true;

    // Store reference to the script
    scriptRef.current = script;

    // Handle load errors
    script.onerror = () => {
      console.error('Failed to load Sveltia CMS script.');
      scriptRef.current = null;
    };

    // Append script to document head for better compatibility
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  return <div id="sveltia-cms-root" />;
}
