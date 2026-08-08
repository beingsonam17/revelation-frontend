import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://revelationpestcontrol.com';
  const currentDate = new Date().toISOString();

  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/services/residential-pest-control',
    '/services/bed-bug-treatment',
    '/services/bees-wasps-removal',
    '/services/antitermite-treatment',
    '/services/rodent-control',
    '/services/mosquito-control',
    '/book-now',
    '/faq',
    '/blog',
    '/contact',
    '/login',
    '/register',
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/services') ? 0.9 : 0.7,
  }));
}
