//

import "dotenv/config";
import OpenAI from "openai";
import { buildPrompt } from "./prompts.js";

// ----------------------------------------------

const client = new OpenAI();

const SYSTEM_PROMPT =
  "You fix accessibility issues in React components. Return only the full corrected component code, no explanation, no markdown fences.";

export const repair = async (code, violations) => {
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    temperature: 0,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      { role: "user", content: buildPrompt(code, violations) },
    ],
  });

  return {
    fixedCode: response.choices[0].message.content.trim(),
    tokens: response.usage,
  };
};
