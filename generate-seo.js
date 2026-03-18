import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const BASE_URL = 'https://pixelbead.example.com'; // Replace with actual URL later

if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt);

// Generate sitemap.xml
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);

console.log('✅ SEO files generated: robots.txt, sitemap.xml');
