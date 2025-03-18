//
// Only blog component is allowed to use authors.yml but since we need this in other pages
// we are generating authors.json and put it in src/data which can be imported later easily.
// Commmand: yarn run build-authors

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Input path: blog/authors.yml
const inputPath = path.join(__dirname, '../blog/authors.yml');
// Output path: src/data/authors.json
const outputPath = path.join(__dirname, '../src/data/authors.json');

// Load YAML
const yamlContent = fs.readFileSync(inputPath, 'utf8');
const authors = yaml.load(yamlContent);

// Write JSON
fs.writeFileSync(outputPath, JSON.stringify(authors, null, 2));

console.log('✅ authors.yml successfully converted to authors.json');