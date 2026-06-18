import { defineConfig } from "drizzle-kit";
import path from "path";
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
	schema: "./src/schema/*.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
