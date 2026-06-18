const fs = require("fs");
const path = require("path");

const userAgent = process.env.npm_config_user_agent || "";

if (!userAgent.startsWith("npm/")) {
  console.warn("This project uses npm. Consider running: npm install");
}

for (const file of ["pnpm-lock.yaml", "yarn.lock"]) {
  const target = path.join(__dirname, "..", file);

  if (fs.existsSync(target)) {
    fs.rmSync(target, { force: true });
  }
}
