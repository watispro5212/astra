const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.md'));

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/v7\.5\.0/g, 'v8.0.1');
    content = content.replace(/7\.5\.0/g, '8.0.1');
    content = content.replace(/Titan/g, 'Quantum');
    content = content.replace(/titan/g, 'quantum');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
}
