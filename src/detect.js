//

import fs from "fs/promises";
import path from "path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

// ----------------------------------------------

const TARGET_FILE = path.resolve("harness/Target.jsx");
const HARNESS_URL = "http://localhost:5173";

const PAGE_LEVEL_RULES = [
  "region",
  "landmark-one-main",
  "page-has-heading-one",
];

let browser;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (violations) =>
  violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    description: v.description,
    wcag: v.tags.filter((t) => t.startsWith("wcag")),
    nodes: v.nodes.map((n) => ({
      html: n.html,
      target: n.target,
      summary: n.failureSummary,
    })),
  }));

export const closeBrowser = async () => {
  if (browser) await browser.close();
  browser = null;
};

export const detect = async (code) => {
  await fs.writeFile(TARGET_FILE, code, "utf8");
  await wait(300);

  browser ??= await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));

  try {
    await page.goto(HARNESS_URL);
    await page.waitForSelector("body[data-status]", { timeout: 5000 });

    const status = await page.getAttribute("body", "data-status");
    if (status !== "ready") {
      return { rendered: false, errors, violations: [] };
    }

    const results = await new AxeBuilder({ page })
      .include("#root")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .disableRules(PAGE_LEVEL_RULES)
      .analyze();

    return {
      rendered: true,
      errors,
      violations: normalize(results.violations),
    };
  } catch (err) {
    return {
      rendered: false,
      errors: [...errors, err.message],
      violations: [],
    };
  } finally {
    await context.close();
  }
};
