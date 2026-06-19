import { config as loadEnv } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, "../../.env") });

const { Pool } = pg;

let _pool: pg.Pool | undefined;
let _db: ReturnType<typeof drizzle> | undefined;

function initDb() {
	if (_pool && _db) return;
	const url = process.env.DATABASE_URL;
	if (!url) {
		// no DB configured; leave undefined so server can start without DB
		// eslint-disable-next-line no-console
		console.warn(
			"DATABASE_URL not set. Database initialization skipped — set DATABASE_URL to enable DB.",
		);
		return;
	}

	_pool = new Pool({ connectionString: url });
	_db = drizzle(_pool, { schema });
}

export function getPool(): pg.Pool | undefined {
	initDb();
	return _pool;
}

export function getDb(): ReturnType<typeof drizzle> | undefined {
	initDb();
	return _db;
}

function makeProxy<T>(getter: () => T | undefined, name: string): T {
	const handler: ProxyHandler<any> = {
		get(_, prop) {
			const target = getter();
			if (!target) throw new Error(`${name} is not initialized. Set DATABASE_URL or call initDb()`);
			const v = (target as any)[prop];
			return typeof v === "function" ? v.bind(target) : v;
		},
		apply(_, __, args) {
			const target = getter();
			if (!target) throw new Error(`${name} is not initialized. Set DATABASE_URL or call initDb()`);
			return (target as any)(...args);
		},
	};

	return new Proxy({}, handler) as T;
}

export const pool: pg.Pool = makeProxy<pg.Pool>(() => getPool(), "pool");
export const db: ReturnType<typeof drizzle> = makeProxy(() => getDb(), "db");

export * from "./schema"; 
