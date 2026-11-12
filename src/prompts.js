//

// converts detected violation JSON into readable text
const formatViolations = (violations) =>
  violations
    .map((v, i) => {
      const nodes = v.nodes
        .map((n) => `   Element: ${n.html}\n   Problem: ${n.summary}`)
        .join("\n");
      return `${i + 1}. [${v.id}] ${v.help} (impact: ${v.impact}, ${v.wcag.join(", ")})\n${nodes}`;
    })
    .join("\n\n");

const EXAMPLE = `Example

Violation: [image-alt] Images must have alternate text
Element: <img src="avatar.png">

Before:
const Profile = () => <img src="avatar.png" />;
export default Profile;

After:
const Profile = () => <img src="avatar.png" alt="User avatar" />;
export default Profile;`;

const RULES = `Rules:
Keep the component's behavior, structure and styling the same.
Only change what is needed to fix the listed violations.
Keep the default export.
Return only the complete corrected component code.`;

const zeroShot = (
  code,
  violations,
) => `Fix the accessibility violations in this React component.

Violations found by axe core:
${formatViolations(violations)}

Component:
${code}

${RULES}`;

const fewShot = (code, violations) => `${EXAMPLE}

Now fix the accessibility violations in this React component.

Violations found by axe core:
${formatViolations(violations)}

Component:
${code}

${RULES}`;

const strategies = { zeroShot, fewShot };

export const buildPrompt = (code, violations, strategy = "zeroShot") => {
  if (!strategies[strategy]) {
    throw new Error(`Unknown prompt strategy: ${strategy}`);
  }
  return strategies[strategy](code, violations);
};
