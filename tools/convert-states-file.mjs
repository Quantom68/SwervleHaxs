// convert.mjs
import { readFileSync, writeFileSync } from 'fs';

const inputPath = process.argv[2] || 'states.txt';
const outputPath = process.argv[3] || 'ghost.json';
const optionalName = process.argv[4];

try {
  const fileContent = readFileSync(inputPath, 'utf8').trim();
  
  // Convert the text content to Base64 encoding
  const statesBase64 = Buffer.from(fileContent, 'utf8').toString();

  const ghostData = {
    displayName: "",
    statesBase64: statesBase64
  };

  if (optionalName) {
    ghostData.name = optionalName;
  }

  writeFileSync(outputPath, JSON.stringify(ghostData, null, 2), 'utf8');
  console.log(`Successfully converted ${inputPath} to ${outputPath}`);
} catch (error) {
  console.error(`Error processing file: ${error.message}`);
}