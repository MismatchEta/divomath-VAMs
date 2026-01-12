const fs = require('fs');
const path = require('path');
const eventOrder = require('./src/eventOrder.js');

const filename = path.join(__dirname, 'vam.cdyjs');

// Read building blocks and extract build number
let buildnr = fs.readFileSync(path.join(__dirname, 'buildingblocks'), 'utf8');
console.log(buildnr);
buildnr = buildnr.split('\n');
buildnr = parseInt(buildnr[0].split(' ')[1]) + 1; // New build number as int
const date = new Date().toISOString();

// Write new build number and date back to buildingblocks file
let output = 'build ' + buildnr + '\n' + date;
fs.writeFileSync(path.join(__dirname, 'buildingblocks'), output, 'utf8');

// Beginning Wrapper for output file
output = `() => ({ // ***build ` + buildnr + ' | ' + (new Date()).toISOString() + `***
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