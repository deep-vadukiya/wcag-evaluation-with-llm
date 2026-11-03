## Evaluating Large Language Models for the Automated Repair of WCAG Violations in React Components

Master thesis project (M.Sc. Applied Computer Science, SRH University Heidelberg).

This project explores how well Large Language Models can automatically repair accessibility violations in React components. Each component is rendered in a browser, scanned with axe core, repaired by an OpenAI model, and scanned again to measure whether the fix worked and whether new issues were introduced.

## How it works

1. **Detect:** render the component with Playwright and collect violations using axe core
2. **Repair:** send the component code and the violation list to the LLM
3. **Verify:** render the fixed code, scan again, and compare the results
4. **Record:** save metrics for each component in `results/`

## Project structure

components/ React components used for testing
harness/ small Vite app that renders one component at a time
src/
index.js runs the full pipeline
detect.js Playwright + axe core scanning
repair.js OpenAI call that returns the fixed code
verify.js rescans the fixed code
prompts.js prompt templates
results/ output of each run

## Setup

Requires Node.js 18 or newer.

npm install
npx playwright install chromium

Create a `.env` file in the root:

```
OPENAI_API_KEY=openai_api_key
OPENAI_MODEL=model_name
```

## Usage

Start the harness:

```
npm run harness
```

In a second terminal, run the pipeline:

```
node src/index.js
```

## Metrics

For each component the following is recorded: violations before repair, violations after repair, newly introduced violations, number of attempts, and token usage.

### Author

Deep
