const fs = require('fs');
const html = fs.readFileSync('scripts/reference-dump.html', 'utf8');

// Find all elements inside the page
const sections = [...html.matchAll(/<section[^>]*class="[^"]*elementor-section[^"]*"[^>]*>([\s\S]*?)<\/section>/gi)];
console.log('Found ' + sections.length + ' sections');

sections.forEach((sec, idx) => {
  const secHtml = sec[0];
  const bgMatch = secHtml.match(/https:\/\/invi\.leafitation\.com\/wp-content\/uploads\/[^\s"'\)]+\.(?:jpg|png|webp)/gi) || [];
  const text = secHtml.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`\n================ SECTION ${idx} ================`);
  console.log('Background / images:', [...new Set(bgMatch)]);
  console.log('Sample text:', text.substring(0, 180));
});
