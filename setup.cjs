const fs = require('fs');
const path = require('path');

const srcDir = `C:\\Users\\user\\.gemini\\antigravity\\brain\\ee8c9637-8323-46f1-9767-9d467bc368cd`;
const destDir = path.join(__dirname, 'public', 'assets');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(path.join(srcDir, 'title_bg_1778061762373.png'), path.join(destDir, 'title_bg.png'));
fs.copyFileSync(path.join(srcDir, 'luna_chibi_1778061775153.png'), path.join(destDir, 'luna_chibi.png'));
fs.copyFileSync(path.join(srcDir, 'grandma_chibi_1778061789136.png'), path.join(destDir, 'grandma_chibi.png'));

console.log('Images copied successfully.');
