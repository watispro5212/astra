const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            processDir(fullPath);
        } else if (entry.isFile() && fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/v7\.5\.0/g, 'v8.0.1');
            content = content.replace(/7\.5\.0/g, '8.0.1');
            content = content.replace(/Titan/g, 'Quantum');
            content = content.replace(/TITAN/g, 'QUANTUM');
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Updated TS ${fullPath}`);
        }
    }
}

processDir(path.join(__dirname, 'src'));
