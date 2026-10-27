const https = require('https');
const fs = require('fs');

https.get('https://invi.leafitation.com/rara-benno/?to=Abdi+Indodana', (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    fs.writeFileSync('scripts/reference-dump.html', data);
    console.log('Saved reference-dump.html (size: ' + data.length + ' bytes)');

    // Let check the desktop layout wrapper
    // In leafitation, desktop mode often has a phone frame in the center or a max-w-[500px] container!
    const containerMatches = data.match(/max-width:\s*500px/gi) || [];
    console.log("max-width 500px matches:", containerMatches.length);
    
    // Check main container width
    const conWidth = data.match(/--content-width:\s*([0-9]+px)/gi) || [];
    console.log("Content width settings:", [...new Set(conWidth)]);
  });
});
