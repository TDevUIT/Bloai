import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_SITE_URL is not defined. Using default robots config.");
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
    };
  }
  return {
    rules: [
      {
        userAgent: '*', 
        allow: '/', 
        disallow: [
            '/api/', 
            '/new-post/',
          
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}