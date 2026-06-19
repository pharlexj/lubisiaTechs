const fs = require('fs');
const path = require('path');

// Always resolve relative to project root
const filesToRemove = ['package-lock.json', 'yarn.lock'];

filesToRemove.forEach(file => {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted ${file}`);
    } catch (err) {
      console.error(`Failed to delete ${file}:`, err.message);
    }
  }
});

// Detect package manager from user agent
const ua = process.env.npm_config_user_agent || '';
if (!ua.startsWith('pnpm/')) {
  console.error('❌ Please use pnpm to install dependencies');
  process.exit(1);
} else {
  console.log('✅ pnpm detected, proceeding with install');
}

