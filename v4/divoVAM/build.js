const fs = require('fs');
const path = require('path');
const eventOrder = require('./src/eventOrder.js');

const filename = path.join(__dirname, 'vam.cdyjs');

// Beginning Wrapper
let output = `() => ({
scripts: {`;

// Add scripts for each event to output
for (const [event, files] of Object.entries(eventOrder)) {
    let content = '';
    for (const relPath of files) {
        const filePath = path.join(__dirname, 'src', relPath);
        if (fs.existsSync(filePath)) {
            content += fs.readFileSync(filePath, 'utf8') + '\n';
        } else {
            console.warn(`Warning: File not found - ${filePath}`);
        }
    }
    output += `\n    ${event}: \n\`${content}\`,\n`;
};

// End script wrapper
output += "},";

// Add footer info
const footerPath = path.join(__dirname, 'src', 'footer.cdyjs');
if (fs.existsSync(footerPath)) {
  output += '\n' + fs.readFileSync(footerPath, 'utf8');
}

// End Wrapper
output += `\n});`;

// Write to file
fs.writeFileSync(filename, output, 'utf8');
console.log(`Build complete: ${filename}`);