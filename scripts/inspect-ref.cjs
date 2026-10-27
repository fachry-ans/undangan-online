const https = require('https');
const fs = require('fs');

https.get('https://invi.leafitation.com/rara-benno/?to=Abdi+Indodana', (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    // 1. Unique assets
    const regex = /https:\/\/invi\.leafitation\.com\/wp-content\/uploads\/[^\s"'\)]+/g;
    const matches = data.match(regex) || [];
    const unique = [...new Set(matches)];
    console.log('=== UNIQUE ASSETS IN REFERENCE ===');
    unique.forEach((u) => console.log(u));

    // 2. Sections structure and elementor data-settings
    console.log('\n=== SECTIONS AND HEADINGS ===');
    const sections = [...data.matchAll(/<section[^>]*>([\s\S]*?)<\/section>/gi)];
    sections.forEach((sec, idx) => {
      const idMatch = sec[0].match(/id="([^"]+)"/);
      const classMatch = sec[0].match(/class="([^"]+)"/);
      const h2 = [...sec[1].matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)].map((h) =>
        h[1].replace(/<[^>]+>/g, '').trim()
      );
      console.log(`\nSection #${idx}: id=${idMatch ? idMatch[1] : 'none'}, h=${JSON.stringify(h2)}`);
    });
  });
});
