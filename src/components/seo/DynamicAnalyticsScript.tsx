'use client';

import React from 'react';
import Script from 'next/script';
import { useGetSiteSettingsQuery } from '@/store/api/siteSettingsApi';

export function DynamicAnalyticsScript() {
  const { data: settings } = useGetSiteSettingsQuery();

  const gaId = settings?.googleAnalyticsId || 'G-QWLSRQMK66';
  const customScripts = settings?.customHeaderScripts;

  return (
    <>
      {/* Dynamic Google Analytics (gtag.js) */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-dynamic" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {/* Dynamic Custom Header Scripts */}
      {customScripts && (
        <div
          dangerouslySetInnerHTML={{ __html: customScripts }}
        />
      )}
    </>
  );
}
