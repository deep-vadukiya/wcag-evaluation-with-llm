//

import "dotenv/config";
import OpenAI from "openai";
import { buildPrompt } from "./prompts.js";

// ----------------------------------------------

const client = new OpenAI();

const SYSTEM_PROMPT =
  "You fix accessibility issues in React components. Return only the full corrected component code, no explanation, no markdown fences.";

const codeCleanUp = (text) =>
  text
    .replace(/^```[a-z]*\n?/i, "")
    .replace(/\n?```\s*$/, "")
    .trim();

export const repair = async (code, violations, strategy = "zeroShot") => {
  const prompt = buildPrompt(code, violations, strategy);

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    temperature: 1,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      { role: "user", content: buildPrompt(code, violations) },
    ],
  });

  return {
    fixedCode: codeCleanUp(response.choices[0].message.content ?? ""),
    prompt,
    tokens: response.usage,
  };
};
