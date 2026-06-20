import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const scriptDir = resolve(fileURLToPath(new URL(".", import.meta.url)));
const repoRoot = resolve(scriptDir, "..", ".");
const envPath = resolve(repoRoot, ".env");
let envText;

try {
  envText = readFileSync(envPath, "utf8");
} catch {
  // No .env present; nothing to load.
  envText = "";
}

for (const line of envText.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;

  const match = trimmed.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if (!match) continue;

  const key = match[1];
  let value = match[2].trim();

  if (value.startsWith("\"") && value.endsWith("\"")) {
    try {
      value = JSON.parse(value);
    } catch {
      value = value.slice(1, -1);
    }
  } else if (value.startsWith("'") && value.endsWith("'")) {
    value = value.slice(1, -1);
  } else {
    const hashIndex = value.indexOf(" #");
    if (hashIndex !== -1) {
      value = value.slice(0, hashIndex).trim();
    }
  }

  if (process.env[key] === undefined) {
    process.env[key] = value;
  }
}
