const fs = require('fs');
const path = require('path');

const ga4Id = process.env.GA4_MEASUREMENT_ID || '';
console.log('Injecting GA4 Measurement ID:', ga4Id ? 'FOUND' : 'NOT FOUND/EMPTY');

const appJsPath = path.join(__dirname, 'app.js');

if (fs.existsSync(appJsPath)) {
  let content = fs.readFileSync(appJsPath, 'utf8');
  
  if (content.includes('__GA4_MEASUREMENT_ID__')) {
    content = content.replace('__GA4_MEASUREMENT_ID__', ga4Id);
    fs.writeFileSync(appJsPath, content, 'utf8');
    console.log('Successfully injected GA4 Measurement ID into app.js');
  } else {
    console.log('Placeholder __GA4_MEASUREMENT_ID__ not found in app.js. Skipping injection.');
  }
} else {
  console.error('Error: app.js not found!');
  process.exit(1);
}
