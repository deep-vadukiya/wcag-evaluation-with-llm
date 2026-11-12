//

import fs from "fs/promises";
import { detect, closeBrowser } from "./detect.js";
import { repair } from "./repair.js";

// ----------------------------------------------

const code = await fs.readFile("components/BadButton.jsx", "utf8");

const before = await detect(code);
console.log(
  "Before:",
  before.violations.map((v) => v.id),
);

const { fixedCode, tokens } = await repair(code, before.violations, "zeroShot");
console.log("\nFixed code:\n", fixedCode);
console.log("\nTokens:", tokens);

const after = await detect(fixedCode);
console.log("\nRendered:", after.rendered);
console.log(
  "After:",
  after.violations.map((v) => v.id),
);

await closeBrowser();
