import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://codewithsindhu.github.io/travel-guide';
const API_URL = 'https://restcountries.com/v3.1/all?fields=name';
const PUBLIC_DIR = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Static routes
const STATIC_ROUTES = [
    '/',
    '/explore',
    '/search',
    '/wishlist',
    '/explore/nature',
    '/explore/historical',
    '/explore/cultural',
    '/explore/adventure',
    '/explore/relaxation',
    '/explore/romantic'
];

async function generateSitemap() {
    console.log('Fetching country data...');
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const countries = await response.json();

        console.log(`Found ${countries.length} countries.`);

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        const currentDate = new Date().toISOString().split('T')[0];

        // Add Static Routes
        STATIC_ROUTES.forEach(route => {
            sitemap += `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
        });

        // Add Dynamic Country Routes
        countries.forEach(country => {
            const name = encodeURIComponent(country.name.common);

            // Country Page
            sitemap += `
  <url>
    <loc>${BASE_URL}/country/${name}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

            // Country Cities Page
            sitemap += `
  <url>
    <loc>${BASE_URL}/country/${name}/cities</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
        });

        sitemap += `
</urlset>`;

        fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
        console.log('✅ Sitemap generated successfully at public/sitemap.xml');

    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
