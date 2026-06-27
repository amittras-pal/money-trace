/**
 * copy-assets.js
 *
 * Copies non-TypeScript asset directories from src/ to build/.
 * tsc only compiles .ts files, so static assets like ML models,
 * data files, and font/image assets must be copied separately.
 *
 * Used by: render-postbuild script, and can be used in any build pipeline.
 */
const fs = require("fs");
const path = require("path");

const ASSETS_TO_COPY = ["ml-models", "data", "assets"];

const srcDir = path.join(__dirname, "..", "src");
const buildDir = path.join(__dirname, "..", "build");

for (const asset of ASSETS_TO_COPY) {
  const src = path.join(srcDir, asset);
  const dest = path.join(buildDir, asset);

  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`Copied: src/${asset} -> build/${asset}`);
  } else {
    console.log(`Skipped: src/${asset} (not found)`);
  }
}
