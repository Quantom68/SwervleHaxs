// convert-states-file.mjs
// Usage:
//   node tools/convert-states-file.mjs <states.txt> <ghost.json> [display name]
//   node tools/convert-states-file.mjs <states-folder> [out-folder]
//
// Single-file mode: converts one states file to one ghost.json.
// Folder mode: converts every .txt file in <states-folder> to a .json file
// with the same base name in [out-folder] (defaults to <states-folder>
// itself). Each ghost's `name` is set to its source file's base name.
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, basename, extname } from 'path';

const inputPath = process.argv[2] || 'states.txt';
const arg3 = process.argv[3];
const arg4 = process.argv[4];

function convertFile(inFile, outFile, name) {
  const fileContent = readFileSync(inFile, 'utf8').trim();

  // Same behavior as before: the file contents are used as-is.
  const statesBase64 = Buffer.from(fileContent, 'utf8').toString();

  const ghostData = {
    displayName: "",
    statesBase64: statesBase64
  };

  if (name) {
    ghostData.name = name;
  }

  writeFileSync(outFile, JSON.stringify(ghostData, null, 2), 'utf8');
  console.log(`Successfully converted ${inFile} to ${outFile}`);
}

try {
  if (existsSync(inputPath) && statSync(inputPath).isDirectory()) {
    // ---- Folder mode ----
    const outDir = arg3 || inputPath;
    mkdirSync(outDir, { recursive: true });

    const files = readdirSync(inputPath).filter(
      (f) => extname(f).toLowerCase() === '.txt' && statSync(join(inputPath, f)).isFile()
    );

    if (files.length === 0) {
      console.error(`No .txt files found in ${inputPath}`);
      process.exitCode = 1;
    } else {
      let ok = 0;
      let failed = 0;
      for (const file of files) {
        const base = basename(file, extname(file));
        try {
          convertFile(join(inputPath, file), join(outDir, `${base}.json`), base);
          ok++;
        } catch (error) {
          // One bad file shouldn't stop the rest of the folder.
          console.error(`Error processing ${file}: ${error.message}`);
          failed++;
        }
      }
      console.log(`\nDone: ${ok} converted, ${failed} failed.`);
      if (failed > 0) process.exitCode = 1;
    }
  } else {
    // ---- Single-file mode (original behavior) ----
    convertFile(inputPath, arg3 || 'ghost.json', arg4);
  }
} catch (error) {
  console.error(`Error processing file: ${error.message}`);
  process.exitCode = 1;
}