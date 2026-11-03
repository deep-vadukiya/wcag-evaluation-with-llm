//

import fs from "fs/promises";
import { detect, closeBrowser } from "./detect.js";

// ----------------------------------------------

const code = await fs.readFile("components/BadButton.jsx", "utf8");

const result = await detect(code);

console.log(JSON.stringify(result, null, 2));

await closeBrowser();
