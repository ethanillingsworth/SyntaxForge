import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pagesDir = path.join(__dirname, '../src/pages');
const scriptTag = '\n    <script type="module" src="/js/protected-routes.js"></script>\n  </body>';

// Read all HTML files in the pages directory
fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.html'))
  .forEach(file => {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Only add the script if it's not already there
    if (!content.includes('protected-routes.js')) {
      content = content.replace('</body>', scriptTag);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file} with protected routes script`);
    }
  });

console.log('All HTML files have been updated with protected routes.');
